/**
 * Fitzeous Fitness Chatbot - Frontend Widget
 * Connects to Cloudflare Worker backend
 */

(function() {
  'use strict';

  // Configuration - API endpoint (relative path works with unified worker)
  const CHATBOT_API_URL = '/api/chat';
  
  // This works because the worker serves both the site and API
  
  let chatOpen = false;
  let messageHistory = [];

  // Create chatbot UI
  function createChatbotUI() {
    const chatHTML = `
      <div id="fitzeous-chat-widget">
        <!-- Chat Button -->
        <button id="chat-toggle-btn" class="chat-toggle" aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <!-- Chat Window -->
        <div id="chat-window" class="chat-window" style="display: none;">
          <div class="chat-header">
            <div class="chat-header-content">
              <strong>💪 Fitzeous Fitness Bot</strong>
              <span class="chat-status">Online</span>
            </div>
            <button id="chat-close-btn" class="chat-close" aria-label="Close chat">×</button>
          </div>
          
          <div id="chat-messages" class="chat-messages">
            <div class="bot-message">
              <div class="message-content">
                👋 Hi! I'm the Fitzeous Fitness assistant. Ask me about our services, membership, hours, or anything fitness-related!
              </div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <input 
              type="text" 
              id="chat-input" 
              class="chat-input" 
              placeholder="Type your message..."
              autocomplete="off"
            />
            <button id="chat-send-btn" class="chat-send" aria-label="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
    addChatbotStyles();
    attachEventListeners();
  }

  // Add CSS styles
  function addChatbotStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #fitzeous-chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .chat-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #035503 0%, #058a00 100%);
        border: none;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .chat-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.4);
      }

      .chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chat-header {
        background: linear-gradient(135deg, #035503 0%, #058a00 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .chat-status {
        font-size: 12px;
        opacity: 0.9;
      }

      .chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 28px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .chat-close:hover {
        background: rgba(255,255,255,0.2);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f5f5f5;
      }

      .bot-message, .user-message {
        display: flex;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .bot-message {
        justify-content: flex-start;
      }

      .user-message {
        justify-content: flex-end;
      }

      .message-content {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        line-height: 1.4;
        font-size: 14px;
      }

      .bot-message .message-content {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
      }

      .user-message .message-content {
        background: #035503;
        color: white;
        border-bottom-right-radius: 4px;
      }

      .chat-input-container {
        display: flex;
        padding: 12px;
        background: white;
        border-top: 1px solid #e0e0e0;
        gap: 8px;
      }

      .chat-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .chat-input:focus {
        border-color: #035503;
      }

      .chat-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #035503;
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .chat-send:hover {
        background: #058a00;
      }

      .chat-send:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
        background: white;
        border-radius: 12px;
        width: fit-content;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #999;
        animation: typing 1.4s infinite;
      }

      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      @media (max-width: 480px) {
        .chat-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          bottom: 80px;
          right: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Attach event listeners
  function attachEventListeners() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Toggle chat window
  function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    
    if (chatOpen) {
      chatWindow.style.display = 'flex';
      toggleBtn.style.display = 'none';
      document.getElementById('chat-input').focus();
    } else {
      chatWindow.style.display = 'none';
      toggleBtn.style.display = 'flex';
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Disable input while processing
    const sendBtn = document.getElementById('chat-send-btn');
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Call chatbot API
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator();
      
      // Add bot response
      addMessage(data.response || 'Sorry, I encountered an error. Please try again.');
      
    } catch (error) {
      console.error('Chatbot error:', error);
      removeTypingIndicator();
      addMessage('Sorry, I\'m having trouble connecting. Please try again later or contact us directly.');
    } finally {
      // Re-enable input
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbotUI);
  } else {
    createChatbotUI();
  }
})();

// Made with Bob
