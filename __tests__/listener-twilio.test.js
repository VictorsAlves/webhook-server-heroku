const request = require('supertest');
const express = require('express');

const listenerRoute = require('../service/listener-twilio');

function createApp() {
  const app = express();
  // listener-twilio uses express.urlencoded for a specific path; to make tests simple, mount normally
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  listenerRoute(app);
  return app;
}

describe('listener-twilio', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('GET /webhook-listener returns active status', async () => {
    const app = createApp();
    const res = await request(app).get('/webhook-listener').expect(200);
    expect(res.body).toHaveProperty('status', 'active');
  });

  test('POST /webhook-listener logs payload and returns success', async () => {
    const app = createApp();
    const payload = {
      EventType: 'onMessageAdded',
      ConversationSid: 'CH1',
      Body: 'Hello%20World',
      Author: 'whatsapp:%2B551199999999'
    };

    const res = await request(app)
      .post('/webhook-listener')
      .type('form')
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    // Ensure logger was called
    expect(consoleSpy).toHaveBeenCalled();
  });
});
