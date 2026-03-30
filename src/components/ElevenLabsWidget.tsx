'use client';

import { useState, useEffect, useRef } from 'react';

const AGENT_ID = 'agent_8101kmpnp2nff0ts5vcrzxxfe16y';

export default function ElevenLabsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

   const startConversation = async () => {
     try {
       setStatus('connecting');
       setIsOpen(true);
       
       // For now, let's use the embed approach
       setStatus('idle');
     } catch (error) {
       console.error('Error connecting:', error);
       setStatus('error');
     }
   };

   useEffect(() => {
     // Dynamically load the ElevenLabs widget script
     const script = document.createElement('script');
     script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
     script.async = true;
     script.onload = () => {
       // Initialize the widget after script loads
       // @ts-ignore - ElevenLabsWidget is added to window by the script
       if (window.ElevenLabsWidget) {
         // @ts-ignore - ElevenLabsWidget is added to window by the script
         window.ElevenLabsWidget.init({
           agentId: 'agent_8101kmpnp2nff0ts5vcrzxxfe16y',
           container: document.getElementById('elevenlabs-widget-container')
         });
       }
     };
     document.head.appendChild(script);
 
     return () => {
       // Cleanup
       // @ts-ignore - ElevenLabsWidget is added to window by the script
       if (window.ElevenLabsWidget && window.ElevenLabsWidget.unmount) {
         // @ts-ignore - ElevenLabsWidget is added to window by the script
         window.ElevenLabsWidget.unmount();
       }
     };
   }, []);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#7C3AED',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        💬
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '450px',
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#7C3AED',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>AI Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {status === 'connected' ? 'Online' : 'Click to start'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                <p>👋 Hi! I'm your AI assistant.</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Click the button below to start a conversation.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? '#7C3AED' : '#2d2d44',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    maxWidth: '80%',
                    fontSize: '14px',
                  }}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(124, 58, 237, 0.2)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                backgroundColor: '#2d2d44',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#7C3AED',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Send
            </button>
          </div>

          {/* Start Voice Button */}
          <div style={{ padding: '12px', borderTop: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <a
              href="https://elevenlabs.io/app/talk-to?agent_id=agent_8101kmpnp2nff0ts5vcrzxxfe16y&branch_id=agtbrch_5401kmpnp3kjftabkygpt76age6q"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '12px',
                backgroundColor: '#10B981',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              🎤 Start Voice Conversation
            </a>
          </div>
        </div>
      )}

      {/* Hidden ElevenLabs widget container - the script will create the widget */}
       <div id="elevenlabs-widget-container" style={{ display: 'none' }}></div>
    </>
  );

  function sendMessage() {
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: inputText }]);
    
    // Simulate AI response (in production, connect to your backend)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Thanks for your message! Click "Start Voice Conversation" above to speak with me directly.' 
      }]);
    }, 1000);
    
    setInputText('');
  }
}
