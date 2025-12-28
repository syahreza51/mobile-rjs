import { open } from 'react-native-quick-sqlite';

// Buka koneksi ke database lokal
export const db = open({ name: 'InspectorRjs.db' });

export const initDatabase = () => {
  // 1. Tabel User untuk Login Dummy
  db.execute(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, name TEXT)',
  );

  // 2. Tabel Inspeksi Forklift
  db.execute(
    'CREATE TABLE IF NOT EXISTS inspections (id INTEGER PRIMARY KEY AUTOINCREMENT, data JSON, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
  );

  // Tambahkan user dummy jika belum ada
  const user = db.execute('SELECT * FROM users WHERE email = ?', [
    'admin@rjs.com',
  ]);
  if (user.rows.length === 0) {
    db.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [
      'admin@rjs.com',
      '123456',
      'Andi Inspector',
    ]);
  }
};
