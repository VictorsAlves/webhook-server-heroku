const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Express leia JSON no corpo da requisição
app.use(bodyParser.json());

// Importa e configura as rotas do clean-conversation
require("./service/remove-conversations")(app);
require("./service/fetch-conversations")(app);
require("./service/create-webhook")(app);
require("./service/list-webhooks")(app);
require("./service/remove-webhook")(app);
require("./service/listener-twilio")(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
