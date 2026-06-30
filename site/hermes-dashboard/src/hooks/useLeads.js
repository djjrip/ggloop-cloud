import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { HERMES_SOCKET_URL, SOCKET_CONNECT_TIMEOUT_MS, EVENTS } from '../lib/config';
import { normalizeLead } from '../lib/mockLeads';

const MAX_FEED = 25;

/**
 * useLeads — connects to the Hermes V2 broker over Socket.IO and streams
 * REAL leads only. No mock data. No fake numbers.
 *
 * status: 'connecting' | 'live' | 'offline'
 */
export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [paused, setPaused] = useState(false);
  const [totalSeen, setTotalSeen] = useState(0);
  const [highValue, setHighValue] = useState(0);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const socketRef = useRef(null);

  const addLead = useCallback((lead) => {
    if (pausedRef.current) return;
    setLeads((prev) => [lead, ...prev].slice(0, MAX_FEED));
    setTotalSeen((n) => n + 1);
    if (lead.mrr >= 5000) {
      setHighValue((n) => n + 1);
    }
  }, []);

  useEffect(() => {
    let socket;
    try {
      socket = io(HERMES_SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: SOCKET_CONNECT_TIMEOUT_MS,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        setStatus('live');
        console.log('🟢 Connected to Hermes Broker', socket.id);
      });

      socket.on(EVENTS.NEW_LEAD, (raw) => addLead(normalizeLead(raw)));

      socket.on('connect_error', () => {
        setStatus('offline');
      });
      socket.on('disconnect', () => {
        setStatus('connecting');
      });
    } catch (err) {
      console.warn('socket.io init failed', err);
      setStatus('offline');
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [addLead]);

  return { leads, status, paused, setPaused, totalSeen, highValue };
}
