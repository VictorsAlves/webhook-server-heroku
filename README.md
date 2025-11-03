# Webhook Server (Heroku)

Pequeno servidor Express que recebe webhooks e fornece uma página visual de dashboard (apenas front-end por enquanto).

Como executar localmente

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
npm start
```

3. Abra no navegador:

http://localhost:3000/

O dashboard mostra 5 funcionalidades como placeholders:

- Criar target de studio
- Criar target de webhook
- Listar todos webhooks
- Remover webhook específico
- Buscar conversation

Observações

- As funcionalidades listadas são apenas visuais nesta versão. A lógica do backend será implementada em etapas posteriores.
