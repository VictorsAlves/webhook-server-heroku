async function handleListConversations() {
  const conversationSid = document.getElementById('conversationSid').value;
  if (!conversationSid) {
    alert('Por favor, insira um Conversation SID');
    return;
  }
  
  try {
    const result = await listConversations(conversationSid);
    document.getElementById('conversation-result').innerHTML = '<pre>' + result + '</pre>';
  } catch (error) {
    alert('Erro ao listar conversations: ' + error.message);
  }
}

async function handleClearConversation() {
  const conversationSid = document.getElementById('clearConversationSid').value;
  if (!conversationSid) {
    alert('Por favor, insira um Conversation SID');
    return;
  }
  
  try {
    const result = await clearConversation(conversationSid);
    alert('Conversation limpa: ' + result);
  } catch (error) {
    alert('Erro ao limpar conversation: ' + error.message);
  }
}

async function handleCreateStudio() {
  const form = document.getElementById('form-create-studio');
  const studioName = form.studioName.value;
  if (!studioName) {
    alert('Por favor, insira um nome para o studio');
    return;
  }
  
  try {
    const response = await fetch('/set-studio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studioName })
    });
    const result = await response.text();
    alert('Studio criado: ' + result);
  } catch (error) {
    alert('Erro ao criar studio: ' + error.message);
  }
}

async function handleCreateWebhook() {
  const form = document.getElementById('form-create-webhook');
  const webhookUrl = form.webhookUrl.value;
  const webhookDesc = form.webhookDesc.value;
  
  if (!webhookUrl) {
    alert('Por favor, insira uma URL para o webhook');
    return;
  }
  
  try {
    const response = await fetch('/set-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl, webhookDesc })
    });
    const result = await response.text();
    alert('Webhook criado: ' + result);
  } catch (error) {
    alert('Erro ao criar webhook: ' + error.message);
  }
}

async function handleRemoveWebhook() {
  const form = document.getElementById('form-delete-webhook');
  const webhookId = form.webhookId.value;
  
  if (!webhookId) {
    alert('Por favor, insira um ID do webhook');
    return;
  }
  
  try {
    const response = await fetch('/remove-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookId })
    });
    const result = await response.text();
    alert('Webhook removido: ' + result);
  } catch (error) {
    alert('Erro ao remover webhook: ' + error.message);
  }
}