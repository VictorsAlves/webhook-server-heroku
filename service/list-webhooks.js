// Endpoint que lista os webhooks
module.exports = (app) => {
  app.post("/list-webhook", async (req, res) => {
    console.log("Mensagem recebida:");
    console.log(req.body);
    
    const { conversationSid } = req.body;
    
    // Validação se o conversationSid foi enviado
    if (!conversationSid) {
      return res.status(400).json({ error: "conversationSid é obrigatório" });
    }
    
    try {
      const webhooks = await listWebhooks(conversationSid, accountSid, authToken);
      // Retorna os webhooks como JSON
      res.status(200).json(webhooks);
    } catch (error) {
      console.error("Erro ao buscar webhooks:", error);
      res.status(500).json({ error: "Erro ao buscar webhookss" });
    }
  });
};



async function listWebhooks(conversationSid, accountSid, authToken) {
    const client = twilio(accountSid, authToken);
  try {
    const webhooks = await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.list();

    console.log("List of webhooks:", webhooks);

    const studioWebhookSid = webhooks.find(
      (webhook) => webhook.target === "studio"
    )?.sid;

    if (studioWebhookSid) {
      console.log("Studio webhook SID:", studioWebhookSid);
    } else {
      console.log("No studio webhook found.");
    }
  } catch (error) {
    console.error("Error listing webhooks:", error);
  }
}