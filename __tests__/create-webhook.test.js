const request = require('supertest');
const express = require('express');

jest.mock('twilio');
const twilio = require('twilio');

const createRoute = require('../service/create-webhook');

function createApp() {
  const app = express();
  app.use(express.json());
  createRoute(app);
  return app;
}

describe('POST /create-webhook', () => {
  afterEach(() => jest.resetAllMocks());

  test('creates studio webhook when flowSid provided', async () => {
    const fakeWebhook = { sid: 'WH-S', target: 'studio', configuration: { filters: ['onMessageAdded'] } };

    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn(() => ({ webhooks: { create: jest.fn().mockResolvedValue(fakeWebhook) } })),
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', flowSid: 'FW1' })
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.webhook).toHaveProperty('type', 'studio');
    expect(res.body.webhook.sid).toBe('WH-S');
  });

  test('creates url webhook when configurationUrl provided', async () => {
    const fakeWebhook = { sid: 'WH-U', target: 'webhook', configuration: { method: 'POST', filters: ['onMessageAdded'] } };

    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn(() => ({ webhooks: { create: jest.fn().mockResolvedValue(fakeWebhook) } })),
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', configurationUrl: 'https://ex.com' })
      .expect(200);

    expect(res.body.webhook).toHaveProperty('type', 'webhook');
    expect(res.body.webhook.sid).toBe('WH-U');
  });

  test('returns 400 when neither flowSid nor configurationUrl', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when required fields are missing', async () => {
    const app = createApp();

    await request(app)
      .post('/create-webhook')
      .send({})
      .expect(400);
  });

  test('returns 400 when both flowSid and configurationUrl provided', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', flowSid: 'FW1', configurationUrl: 'https://ex.com' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('returns 500 when createStudioWebhook throws', async () => {
    // Mock create to reject
    const mockCreate = jest.fn().mockRejectedValue(new Error('studio error'));
    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn(() => ({ webhooks: { create: mockCreate } })),
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', flowSid: 'FW1' })
      .expect(500);

    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toMatch(/Falha ao criar webhook Studio/);
  });

  test('returns 500 when createUrlWebhook throws', async () => {
    // Mock create to reject
    const mockCreate = jest.fn().mockRejectedValue(new Error('url error'));
    const mockClient = {
      conversations: {
        v1: {
          conversations: jest.fn(() => ({ webhooks: { create: mockCreate } })),
        }
      }
    };

    twilio.mockImplementation(() => mockClient);

    const app = createApp();

    const res = await request(app)
      .post('/create-webhook')
      .send({ accountSid: 'AC', authToken: 'TOK', conversationSid: 'CH1', configurationUrl: 'https://ex.com' })
      .expect(500);

    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toMatch(/Falha ao criar webhook URL/);
  });
});
