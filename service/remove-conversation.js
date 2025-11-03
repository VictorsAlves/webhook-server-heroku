// Endpoint que remove a conversation
module.exports = (app) => {
  app.post("/remove-conversation", async (req, res) => {
    console.log("Mensagem recebida:");
    console.log(req.body);

    const { accountSid, authToken, conversationAddress } = req.body;

    // Validação se o conversationAddress foi enviado
    if (!conversationAddress) {
      return res.status(400).json({ error: "conversationAddress é obrigatório" });
    }
    
    try {
      const conversations = await removeConversations(accountSid, authToken, conversationAddress);
      // Retorna a conversation como JSON
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversation:", error);
      res.status(500).json({ error: "Erro ao remover conversation" });
    }
  });
};

async function removeConversations(accountSid, authToken, conversationAddress) {
    const client = twilio(accountSid, authToken);
  try {
    const conversations =
      await client.conversations.v1.participantConversations.list({
        address: conversationAddress,
      });

    for (const conversation of conversations) {
      await client.conversations.v1
        .conversations(conversation.conversationSid)
        .remove();
    }

    console.log(
      "All address conversations removed successfully",
      conversations
    );
  } catch (error) {
    console.error("Error removing address conversations:", error);
  }
}