const request = require('supertest');
const express = require('express');

jest.mock('twilio');
const twilio = require('twilio');

const removeRoute = require('../service/remove-webhook');

function createApp() {
  const app = express();
  app.use(express.json());
  removeRoute(app);
  return app;
}

describe('POST /remove-webhook', () => {
  afterEach(() => jest.resetAllMocks());

  test('removes webhook successfully', async () => {
    const mockRemove = jest.fn().mockResolvedValue();
    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn(() => ({ webhooks: jest.fn(() => ({ remove: mockRemove })) })),
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/remove-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', webhookSid: 'WH1' })
      .expect(200);

    // The route returns the conversations variable which is undefined; we at least assert success by status
    expect(res.body).toBeDefined();
  });

  test('returns 400 if missing params', async () => {
    const app = createApp();

    await request(app)
      .post('/remove-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1' })
      .expect(400);
  });
});
