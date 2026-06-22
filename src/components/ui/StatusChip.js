import React from 'react';
import { Chip } from 'react-native-paper';

const STATUS_MAP = {
  draft: { bg: '#FEF9C3', text: '#854D0E', label: 'Draft' },
  completed: { bg: '#DCFCE7', text: '#166534', label: 'Selesai' },
  done: { bg: '#DCFCE7', text: '#166534', label: 'Selesai' },
  failed: { bg: '#FEE2E2', text: '#991B1B', label: 'Gagal' },
  in_progress: { bg: '#DBEAFE', text: '#1E40AF', label: 'Berjalan' },
  default: { bg: '#F1F5F9', text: '#475569', label: 'Siap' },
};

export function getStatusStyle(status) {
  return STATUS_MAP[status] || STATUS_MAP.default;
}

export default function StatusChip({ status, label, compact = true }) {
  const st = getStatusStyle(status);
  return (
    <Chip
      compact={compact}
      style={{ backgroundColor: st.bg }}
      textStyle={{ color: st.text, fontSize: 11, fontWeight: '700' }}
    >
      {label || st.label}
    </Chip>
  );
}
