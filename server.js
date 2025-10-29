const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Express leia JSON no corpo da requisição
app.use(bodyParser.json());

// Endpoint que receberá as mensagens
app.post("/webhook", (req, res) => {
  console.log("Mensagem recebida:");
  console.log(req.body);

  // Retorna uma resposta HTTP 200 (OK)
  res.status(200).send("Mensagem recebida com sucesso!");
});

// Verificação simples (GET)
app.get("/", (req, res) => {
  res.send("Webhook ativo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
