import { useEffect, useRef } from 'react';
import type { BroadcastMessage, GameState } from '../types';

const CHANNEL_NAME = 'rebustle';

export function useBroadcastSender() {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    return () => channelRef.current?.close();
  }, []);

  const send = (state: GameState) => {
    channelRef.current?.postMessage({ type: 'STATE_UPDATE', state } satisfies BroadcastMessage);
  };

  return send;
}

export function useBroadcastReceiver(onState: (state: GameState) => void) {
  const onStateRef = useRef(onState);
  onStateRef.current = onState;

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);

    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const msg = event.data;
      if (msg.type === 'STATE_UPDATE') {
        onStateRef.current(msg.state);
      }
    };

    // Request current state from GM on mount
    channel.postMessage({ type: 'INIT_REQUEST' } satisfies BroadcastMessage);

    return () => channel.close();
  }, []);
}
