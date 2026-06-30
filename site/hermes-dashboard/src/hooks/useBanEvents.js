import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { HERMES_SOCKET_URL, SOCKET_CONNECT_TIMEOUT_MS } from '../lib/config';

const MAX_LOG = 40;

// Subscribes to anti-cheat ban events emitted by the backend over Socket.IO.
// Real data only — if the broker emits nothing, the log stays empty and the
// page shows a waiting state. Expected event: 'ban_event' with a payload like
// { id, player, server, reason, action, ts }.
export function useBanEvents() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('connecting');
  const socketRef = useRef(null);

  useEffect(() => {
    let socket;
    try {
      socket = io(HERMES_SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: SOCKET_CONNECT_TIMEOUT_MS,
      });
      socketRef.current = socket;

      socket.on('connect', () => setStatus('live'));
      socket.on('connect_error', () => setStatus('offline'));
      socket.on('disconnect', () => setStatus('connecting'));

      socket.on('ban_event', (raw) => {
        const evt = {
          id: raw?.id || `ban-${Date.now()}`,
          player: raw?.player || raw?.user || 'unknown',
          server: raw?.server || raw?.gameServer || '—',
          reason: raw?.reason || raw?.detection || 'Integrity violation',
          action: (raw?.action || 'ban').toUpperCase(),
          ts: raw?.ts || Date.now(),
        };
        setEvents((prev) => [evt, ...prev].slice(0, MAX_LOG));
      });
    } catch {
      setStatus('offline');
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return { events, status };
}
