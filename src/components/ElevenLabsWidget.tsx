'use client';

import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
      }, HTMLElement>;
    }
  }
}

export default function ElevenLabsWidget() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (document.querySelector('script[src*="elevenlabs"]')) {
      setIsLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('ElevenLabs widget script loaded');
      setIsLoaded(true);
    };
    
    script.onerror = (err) => {
      console.error('Failed to load ElevenLabs widget:', err);
    };

    document.head.appendChild(script);

    return () => {
      // Optional cleanup - but keep script for persistence
    };
  }, []);

  return (
    <>
      {!isLoaded && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}>
          <button
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#7C3AED',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => window.open('https://elevenlabs.io/convai', '_blank')}
            title="Start AI Conversation"
          >
            🤖
          </button>
        </div>
      )}
      <elevenlabs-convai 
        agent-id="agent_3b68f10d9e5d5c7e1f5651a9a7"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      />
    </>
  );
}
