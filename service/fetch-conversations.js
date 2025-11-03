// Endpoint que lista a conversation
module.exports = (app) => {
  app.post("/fetch-conversation", async (req, res) => {
    console.log("Mensagem recebida:");
    console.log(req.body);
    
    const { conversationSid } = req.body;
    
    // Validação se o conversationSid foi enviado
    if (!conversationSid) {
      return res.status(400).json({ error: "conversationSid é obrigatório" });
    }
    
    try {
      const conversations = await fetchConversation(conversationSid);
      // Retorna a conversation como JSON
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversation:", error);
      res.status(500).json({ error: "Erro ao buscar conversation" });
    }
  });
};

async function fetchConversation(conversationSid) {
  try {
    const conversation = await client.conversations.v1
      .conversations(conversationSid)
      .fetch();

    console.log("Fetched conversation:", conversation);
    return conversation;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
}