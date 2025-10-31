// WhizBot - AI-Powered Fan Companion for DJ Whizzy
class WhizBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.sessionId = this.generateSessionId();
        this.apiEndpoint = '/api/chat/';
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.createWidget();
        this.attachEventListeners();
        this.loadWelcomeMessage();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'whizbot-widget';
        widget.innerHTML = `
            <!-- Chat Button -->
            <button id="whizbot-toggle" class="whizbot-button">
                <svg class="whizbot-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <span class="whizbot-badge">1</span>
            </button>
            
            <!-- Chat Window -->
            <div id="whizbot-chat" class="whizbot-chat hidden">
                <!-- Header -->
                <div class="whizbot-header">
                    <div class="flex items-center">
                        <div class="whizbot-avatar">
                            <div class="whizbot-avatar-inner">WB</div>
                        </div>
                        <div class="ml-3">
                            <h3 class="font-bold text-lg">WhizBot</h3>
                            <p class="text-xs text-gray-400">DJ Whizzy's AI Assistant</p>
                        </div>
                    </div>
                    <button id="whizbot-close" class="whizbot-close">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Messages Container -->
                <div id="whizbot-messages" class="whizbot-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <!-- Quick Actions -->
                <div id="whizbot-quick-actions" class="whizbot-quick-actions">
                    <button class="quick-action-btn" data-action="tracks">🎵 Latest Tracks</button>
                    <button class="quick-action-btn" data-action="events">🎤 Upcoming Events</button>
                    <button class="quick-action-btn" data-action="merch">🛍️ Shop Merch</button>
                </div>
                
                <!-- Input Area -->
                <div class="whizbot-input-area">
                    <input 
                        type="text" 
                        id="whizbot-input" 
                        placeholder="Ask WhizBot anything..."
                        autocomplete="off"
                    />
                    <button id="whizbot-send" class="whizbot-send-btn">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Typing Indicator -->
                <div id="whizbot-typing" class="whizbot-typing hidden">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        this.injectStyles();
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #whizbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            }
            
            .whizbot-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00E0FF 0%, #7A00FF 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 224, 255, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                animation: pulse 2s infinite;
            }
            
            .whizbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(0, 224, 255, 0.6);
            }
            
            .whizbot-icon {
                width: 28px;
                height: 28px;
                color: white;
            }
            
            .whizbot-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #FF0055;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
            }
            
            .whizbot-chat {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 600px;
                max-height: calc(100vh - 120px);
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(0, 224, 255, 0.2);
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .whizbot-chat.hidden {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
            }
            
            .whizbot-header {
                background: linear-gradient(135deg, rgba(0, 224, 255, 0.2) 0%, rgba(122, 0, 255, 0.2) 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(0, 224, 255, 0.1);
            }
            
            .whizbot-avatar {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00E0FF 0%, #7A00FF 100%);
                padding: 2px;
                animation: glow-pulse 2s ease-in-out infinite;
            }
            
            .whizbot-avatar-inner {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #1A1A1A;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #00E0FF;
            }
            
            .whizbot-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                transition: color 0.3s;
            }
            
            .whizbot-close:hover {
                color: #00E0FF;
            }
            
            .whizbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .whizbot-message {
                display: flex;
                gap: 10px;
                animation: slideInUp 0.3s ease-out;
            }
            
            .whizbot-message.user {
                flex-direction: row-reverse;
            }
            
            .message-avatar {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            
            .message-avatar.bot {
                background: linear-gradient(135deg, #00E0FF 0%, #7A00FF 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: white;
            }
            
            .message-avatar.user {
                background: #444;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.5;
                font-size: 14px;
            }
            
            .whizbot-message.bot .message-content {
                background: rgba(0, 224, 255, 0.1);
                border: 1px solid rgba(0, 224, 255, 0.2);
                color: #E0E0E0;
            }
            
            .whizbot-message.user .message-content {
                background: linear-gradient(135deg, #00E0FF 0%, #7A00FF 100%);
                color: white;
            }
            
            .whizbot-quick-actions {
                padding: 10px 20px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                border-top: 1px solid rgba(0, 224, 255, 0.1);
            }
            
            .quick-action-btn {
                padding: 8px 12px;
                background: rgba(0, 224, 255, 0.1);
                border: 1px solid rgba(0, 224, 255, 0.3);
                border-radius: 20px;
                color: #00E0FF;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
                white-space: nowrap;
            }
            
            .quick-action-btn:hover {
                background: rgba(0, 224, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .whizbot-input-area {
                padding: 15px 20px;
                border-top: 1px solid rgba(0, 224, 255, 0.1);
                display: flex;
                gap: 10px;
            }
            
            #whizbot-input {
                flex: 1;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0, 224, 255, 0.2);
                border-radius: 25px;
                padding: 12px 20px;
                color: white;
                outline: none;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            
            #whizbot-input:focus {
                border-color: #00E0FF;
            }
            
            .whizbot-send-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00E0FF 0%, #7A00FF 100%);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s;
            }
            
            .whizbot-send-btn:hover {
                transform: scale(1.1);
            }
            
            .whizbot-typing {
                padding: 10px 20px;
                display: flex;
                gap: 5px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #00E0FF;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes pulse {
                0%, 100% {
                    box-shadow: 0 4px 20px rgba(0, 224, 255, 0.4);
                }
                50% {
                    box-shadow: 0 4px 30px rgba(0, 224, 255, 0.6), 0 0 40px rgba(122, 0, 255, 0.4);
                }
            }
            
            @keyframes glow-pulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(0, 224, 255, 0.5);
                }
                50% {
                    box-shadow: 0 0 30px rgba(0, 224, 255, 0.8), 0 0 40px rgba(122, 0, 255, 0.6);
                }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes typing {
                0%, 60%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                30% {
                    transform: scale(1.2);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .whizbot-chat {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    bottom: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    attachEventListeners() {
        // Toggle chat
        document.getElementById('whizbot-toggle').addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Close chat
        document.getElementById('whizbot-close').addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Send message
        document.getElementById('whizbot-send').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send on Enter
        document.getElementById('whizbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        const chat = document.getElementById('whizbot-chat');
        const badge = document.querySelector('.whizbot-badge');
        
        if (this.isOpen) {
            chat.classList.remove('hidden');
            if (badge) badge.style.display = 'none';
        } else {
            chat.classList.add('hidden');
        }
    }
    
    loadWelcomeMessage() {
        const welcomeMsg = "Hey! I'm WhizBot, DJ Whizzy's AI assistant. 🎧 How can I help you explore the WhizzyVerse today?";
        this.addMessage(welcomeMsg, 'bot');
    }
    
    addMessage(text, sender = 'user') {
        const messagesContainer = document.getElementById('whizbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `whizbot-message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = `message-avatar ${sender}`;
        avatarDiv.textContent = sender === 'bot' ? 'WB' : 'You';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: new Date() });
    }
    
    showTyping() {
        document.getElementById('whizbot-typing').classList.remove('hidden');
    }
    
    hideTyping() {
        document.getElementById('whizbot-typing').classList.add('hidden');
    }
    
    async sendMessage() {
        const input = document.getElementById('whizbot-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        this.isTyping = true;
        
        try {
            // Send to backend
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCookie('csrftoken')
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });
            
            const data = await response.json();
            
            // Simulate natural typing delay
            setTimeout(() => {
                this.hideTyping();
                this.isTyping = false;
                this.addMessage(data.response || this.getDefaultResponse(message), 'bot');
            }, 1000);
            
        } catch (error) {
            console.error('WhizBot error:', error);
            setTimeout(() => {
                this.hideTyping();
                this.isTyping = false;
                this.addMessage(this.getDefaultResponse(message), 'bot');
            }, 1000);
        }
    }
    
    handleQuickAction(action) {
        const responses = {
            tracks: "Check out DJ Whizzy's latest tracks in the Music Library! From Afrobeats to Electronic, there's something for everyone. 🎵",
            events: "DJ Whizzy has amazing shows coming up across Nigeria! Head to the Events page to see where you can catch him live. 🎤",
            merch: "Want to rep the WhizzyVerse? Browse exclusive merch including tees, hoodies, and limited edition vinyl! 🛍️"
        };
        
        this.addMessage(responses[action], 'bot');
    }
    
    getDefaultResponse(message) {
        const msg = message.toLowerCase();
        
        // Track-related
        if (msg.includes('music') || msg.includes('track') || msg.includes('song')) {
            return "DJ Whizzy's music library features Afrobeats, Hip-Hop, and Electronic fusion! Check out the Music page to listen to his latest drops. 🎵";
        }
        
        // Event-related
        if (msg.includes('event') || msg.includes('show') || msg.includes('concert') || msg.includes('gig')) {
            return "DJ Whizzy performs across Nigeria and beyond! Visit the Events page to see upcoming shows and get tickets. 🎤";
        }
        
        // Merch-related
        if (msg.includes('merch') || msg.includes('shop') || msg.includes('buy') || msg.includes('shirt')) {
            return "Browse the official WhizzyVerse merchandise store for exclusive gear, apparel, and collectibles! 🛍️";
        }
        
        // About DJ Whizzy
        if (msg.includes('who') || msg.includes('about') || msg.includes('whizzy')) {
            return "DJ Whizzy is Nigeria's finest DJ, known for Afrobeats and Electronic fusion. With 100+ shows and 25K+ followers, he's taking the sound dimension to new heights! 🎧";
        }
        
        // Contact/Book
        if (msg.includes('contact') || msg.includes('book') || msg.includes('hire')) {
            return "Want to book DJ Whizzy for your event? Head to the Contact page or DM on Instagram @djwhizzy. Let's make your event unforgettable! 📧";
        }
        
        // Default
        return "That's a great question! Explore the WhizzyVerse to discover DJ Whizzy's music, upcoming events, and exclusive merch. Need help with anything specific? 🎧";
    }
    
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// Initialize WhizBot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.whizBot = new WhizBot();
});
