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
    <elevenlabs-convai agent-id="agent_6501kmp5v1rrec8snxkwnn13q4sr"></elevenlabs-convai>
  );
}
