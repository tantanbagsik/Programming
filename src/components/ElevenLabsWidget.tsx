'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    // Load the ElevenLabs Convai widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    script.onload = () => {
      console.log('ElevenLabs widget loaded');
    };

    return () => {
      // Cleanup - don't remove script on unmount to keep widget available
    };
  }, []);

  return (
    <elevenlabs-convai 
      agent-id="agent_3b68f10d9e5d5c7e1f5651a9a7"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    />
  );
}
