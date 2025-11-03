const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Express leia JSON no corpo da requisição
app.use(bodyParser.json());

// Serve arquivos estáticos (pasta ui)
app.use(express.static(path.join(__dirname, "ui")));

// Página principal (dashboard visual)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "index.html"));
});
// Importa e configura as rotas do clean-conversation
require("./service/remove-conversation")(app);
require("./service/fetch-conversations")(app);
require("./service/create-webhook")(app);
require("./service/list-webhooks")(app);
require("./service/remove-webhook")(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
