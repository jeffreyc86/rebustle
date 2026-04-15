import { useCallback, useEffect, useRef } from 'react';
import type { BroadcastMessage, GameState } from '../types';

const CHANNEL_NAME = 'rebustle';

export function useBroadcastSender() {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    // Notify display screen that GM has (re)loaded — resets any stale game state
    channel.postMessage({ type: 'GAME_RESET' } satisfies BroadcastMessage);
    return () => channel.close();
  }, []);

  const send = useCallback((state: GameState) => {
    channelRef.current?.postMessage({ type: 'STATE_UPDATE', state } satisfies BroadcastMessage);
  }, []);

  return send;
}

export function useBroadcastReceiver(
  onState: (state: GameState) => void,
  onReset?: () => void,
) {
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);

    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const msg = event.data;
      if (msg.type === 'STATE_UPDATE') {
        onStateRef.current(msg.state);
      } else if (msg.type === 'GAME_RESET') {
        onResetRef.current?.();
      }
    };

    // Request current state from GM on mount
    channel.postMessage({ type: 'INIT_REQUEST' } satisfies BroadcastMessage);

    return () => channel.close();
  }, []);
}
