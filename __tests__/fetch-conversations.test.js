const request = require('supertest');
const express = require('express');

jest.mock('twilio');
const twilio = require('twilio');

const fetchRoute = require('../service/fetch-conversations');

function createApp() {
  const app = express();
  app.use(express.json());
  fetchRoute(app);
  return app;
}

describe('POST /fetch-conversations', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns conversation data when Twilio fetch succeeds', async () => {
    const fakeConversation = { sid: 'CH123', friendlyName: 'Test' };

    const mockFetch = jest.fn().mockResolvedValue(fakeConversation);
    const mockConversations = jest.fn(() => ({ fetch: mockFetch }));

    const mockClient = {
      conversations: {
        v1: {
          conversations: mockConversations
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/fetch-conversations')
      .send({ conversationSid: 'CH123', accountSid: 'ACX', authToken: 'TOK' })
      .expect(200);

    expect(res.body).toEqual(fakeConversation);
    expect(mockConversations).toHaveBeenCalledWith('CH123');
  });

  test('returns 500 when Twilio throws', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('twilio error'));
    const mockConversations = jest.fn(() => ({ fetch: mockFetch }));

    const mockClient = {
      conversations: {
        v1: {
          conversations: mockConversations
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/fetch-conversations')
      .send({ conversationSid: 'CH_NOT', accountSid: 'ACX', authToken: 'TOK' })
      .expect(500);

    expect(res.body).toHaveProperty('error');
  });
});
