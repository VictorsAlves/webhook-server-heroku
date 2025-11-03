// Endpoint que cria um webhook
module.exports = (app) => {
  app.post("/remove-webhook", async (req, res) => {
    console.log("Mensagem recebida:");
    console.log(req.body);

    const {accountSid, authToken, conversationSid, webhookSid } = req.body;

    // Validação se o conversationSid foi enviado
    if (!conversationSid || !accountSid || !authToken || !webhookSid) {
      return res.status(400).json({ error: "Os campos conversationSid, accountSid, authToken e webhookSid são obrigatórios" });
    }

      try {
        const conversations = await removeWebhook(accountSid, authToken, conversationSid, webhookSid);
        // Retorna a conversation como JSON
        res.status(200).json(conversations);
      } catch (error) {
        console.error("Erro ao buscar conversation:", error);
        res.status(500).json({ error: "Erro ao buscar conversation" });
      }
      return;
    });
};

async function removeWebhook(accountSid, authToken, conversationSid, webhookSid) {
    const client = twilio(accountSid, authToken);
  try {
    await client.conversations.v1
      .conversations(conversationSid)
      .webhooks(webhookSid)
      .remove();

    console.log("Webhook removed successfully.");
  } catch (error) {
    console.error("Error removing webhook:", error);
  }
}