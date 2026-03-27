'use client';

import { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': any;
    }
  }
}

export default function ElevenLabsWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <elevenlabs-convai agent-id="agent_3b68f10d9e5d5c7e1f5651a9a7"></elevenlabs-convai>
  );
}
