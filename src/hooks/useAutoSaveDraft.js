import { useEffect, useRef, useState } from 'react';

export function useAutoSaveDraft({
  enabled,
  onSave,
  debounceMs = 30000,
  watchKey,
}) {
  const [status, setStatus] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const isInitialMount = useRef(true);
  const timerRef = useRef(null);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setStatus('unsaved');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      setStatus('saving');
      const result = await onSaveRef.current();
      if (result === 'queued') {
        setStatus('queued');
        setLastSavedAt(new Date());
      } else if (result === true || result === 'saved') {
        setStatus('saved');
        setLastSavedAt(new Date());
      } else {
        setStatus('error');
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, debounceMs, watchKey]);

  const markSaved = () => {
    setStatus('saved');
    setLastSavedAt(new Date());
  };

  const markQueued = () => {
    setStatus('queued');
    setLastSavedAt(new Date());
  };

  return { status, lastSavedAt, markSaved, markQueued };
}

export function formatSavedTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AUTO_SAVE_LABELS = {
  idle: { label: '', color: '#94A3B8' },
  unsaved: { label: 'Belum disimpan', color: '#F59E0B' },
  saving: { label: 'Menyimpan...', color: '#93C5FD' },
  saved: { label: 'Tersimpan', color: '#4ADE80' },
  queued: { label: 'Tersimpan lokal', color: '#FBBF24' },
  error: { label: 'Gagal simpan', color: '#F87171' },
};
