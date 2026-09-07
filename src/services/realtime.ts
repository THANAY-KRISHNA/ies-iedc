import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DbChangeEvent {
  entity: string;
  action: 'create' | 'update' | 'delete';
  data?: any;
  timestamp: string;
}

const EVENT_NAME = 'iedc-db-change';

let eventSource: EventSource | null = null;
let isInitialized = false;

/**
 * Initialize real-time listeners for both SSE stream and Supabase Realtime (if available)
 */
export function initRealtimeEngine() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // 1. Connect to Backend SSE Stream (/api/realtime/stream)
  try {
    eventSource = new EventSource('/api/realtime/stream');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as DbChangeEvent;
        if (payload.entity) {
          window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
        }
      } catch (err) {
        console.warn('Failed to parse SSE payload:', err);
      }
    };

    eventSource.onerror = () => {
      // EventSource auto-reconnects natively
    };
  } catch (err) {
    console.warn('SSE EventSource initialization failed:', err);
  }

  // 2. Connect to Supabase Realtime Channel (if Supabase is configured)
  try {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          const entity = payload.table;
          const action = payload.eventType.toLowerCase() as 'create' | 'update' | 'delete';
          window.dispatchEvent(
            new CustomEvent(EVENT_NAME, {
              detail: {
                entity,
                action,
                data: payload.new || payload.old,
                timestamp: new Date().toISOString()
              }
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Supabase Realtime channel setup skipped or failed:', err);
  }
}

/**
 * Dispatch a manual DB update event across local browser context (e.g. after immediate local CRUD action)
 */
export function notifyDataChange(entity: string, action: 'create' | 'update' | 'delete' = 'update', data?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: {
          entity,
          action,
          data,
          timestamp: new Date().toISOString()
        }
      })
    );
  }
}

/**
 * React hook to auto-trigger a callback when relevant database entity changes in real-time,
 * or when browser window regains focus.
 */
export function useRealtimeSync(targetEntities: string[], onDataChanged: () => void) {
  useEffect(() => {
    initRealtimeEngine();

    const handleDbChange = (e: Event) => {
      const customEvt = e as CustomEvent<DbChangeEvent>;
      const changedEntity = customEvt.detail?.entity;

      if (
        !targetEntities ||
        targetEntities.length === 0 ||
        targetEntities.includes('all') ||
        (changedEntity && targetEntities.includes(changedEntity))
      ) {
        onDataChanged();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onDataChanged();
      }
    };

    window.addEventListener(EVENT_NAME, handleDbChange);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleDbChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetEntities.join(','), onDataChanged]);
}
