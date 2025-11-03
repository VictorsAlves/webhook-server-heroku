// Endpoint que cria um webhook
module.exports = (app) => {
  app.post("/create-webhook", async (req, res) => {
    console.log("Mensagem recebida:");
    console.log(req.body);

    const { accountSid, authToken, flowSid, conversationSid, configurationUrl } = req.body;

    // Validação se o conversationSid foi enviado
    if (!conversationSid || !accountSid || !authToken) {
      return res.status(400).json({ error: "Os campos conversationSid, accountSid e authToken são obrigatórios" });
    }

    if (flowSid) {
      try {
        const conversations = await setStudioWebhook(accountSid, authToken, conversationSid, flowSid);
        // Retorna a conversation como JSON
        res.status(200).json(conversations);
      } catch (error) {
        console.error("Erro ao buscar conversation:", error);
        res.status(500).json({ error: "Erro ao buscar conversation" });
      }
      return;
    } else if (configurationUrl) {

      try {
        const conversations = await createWebhook(accountSid, authToken, conversationSid, configurationUrl);
        // Retorna a conversation como JSON
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversation:", error);
      res.status(500).json({ error: "Erro ao buscar conversation" });
    }
  }});
};

async function setStudioWebhook(accountSid, authToken, conversationSid, flowSid) {
    const client = twilio(accountSid, authToken);
  try {
    const webhook = await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.create({
        "configuration.flowSid": flowSid,
        "configuration.replayAfter": 0,
        "configuration.filters": ["onMessageAdded"],
        target: "studio",
      });

    console.log("Created webhook:", webhook);
  } catch (error) {
    console.error("Error creating webhook:", error);
  }
}

async function createWebhook(accountSid, authToken, conversationSid, configurationUrl) {
       const client = twilio(accountSid, authToken);
  try {
    const webhook = await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.create({
        "configuration.method": "POST",
        "configuration.filters": ["onMessageAdded"],
        "configuration.url": configurationUrl,
        target: "webhook",
      });

          console.log("Created webhook:", webhook);
  } catch (error) {
    console.error("Error creating webhook:", error);
  }
}