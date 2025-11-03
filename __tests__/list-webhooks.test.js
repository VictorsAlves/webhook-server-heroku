const request = require('supertest');
const express = require('express');

jest.mock('twilio');
const twilio = require('twilio');

const listRoute = require('../service/list-webhooks');

function createApp() {
  const app = express();
  app.use(express.json());
  listRoute(app);
  return app;
}

describe('POST /list-webhook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns webhooks data when Twilio succeeds', async () => {
    const fakeWebhooks = [
      { sid: 'WH1', target: 'studio' },
      { sid: 'WH2', target: 'webhook' }
    ];

    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn().mockReturnThis(),
          webhooks: {
            list: jest.fn().mockResolvedValue(fakeWebhooks)
          }
        }
      }
    };

    // Twilio SDK chaining: client.conversations.v1.conversations(conversationSid).webhooks.list()
    twilio.mockImplementation(() => mockClient);

    // Patch the conversation function to return an object with webhooks
    mockClient.conversations.v1.conversations = jest.fn(() => ({ webhooks: { list: mockClient.conversations.v1.webhooks.list } }));

    const app = createApp();

    const res = await request(app)
      .post('/list-webhook')
      .send({ conversationSid: 'CH1', accountSid: 'ACX', authToken: 'TOK' })
      .expect(200);

    expect(res.body).toHaveProperty('totalWebhooks', 2);
    expect(res.body).toHaveProperty('studioWebhook');
    expect(res.body.webhooks).toHaveLength(2);
  });

  test('returns 500 when Twilio throws', async () => {
    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn().mockReturnThis(),
          webhooks: {
            list: jest.fn().mockRejectedValue(new Error('twilio error'))
          }
        }
      }
    };

    twilio.mockImplementation(() => mockClient);
    mockClient.conversations.v1.conversations = jest.fn(() => ({ webhooks: { list: mockClient.conversations.v1.webhooks.list } }));

    const app = createApp();

    const res = await request(app)
      .post('/list-webhook')
      .send({ conversationSid: 'CH_NOT', accountSid: 'ACX', authToken: 'TOK' })
      .expect(500);

    expect(res.body).toHaveProperty('error');
  });
});
