import { open } from 'react-native-quick-sqlite';

export const db = open({ name: 'InspectorRjs.db' });

export const initDatabase = () => {
  try {
    // 1. Tambahkan juga tabel USERS untuk login (jika belum ada)
    db.execute(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, name TEXT)',
    );

    db.execute(`
  CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bidang TEXT,
    data TEXT,
    created_at TEXT
  )
`);

    // 3. Tambahkan User Dummy jika tabel masih kosong
    const checkUser = db.execute('SELECT * FROM users');
    if (checkUser.rows.length === 0) {
      db.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [
        'admin@rjs.com',
        '123456',
        'Andi Inspector',
      ]);
    }

    console.log('Database Quick-SQLite Berhasil Diinisialisasi');
  } catch (error) {
    console.error('Gagal inisialisasi database:', error);
  }
};

export const saveInspeksi = formData => {
  try {
    return db.execute('INSERT INTO inspections (data) VALUES (?)', [
      JSON.stringify(formData),
    ]);
  } catch (error) {
    console.error('Gagal simpan ke SQLite:', error);
    throw error;
  }
};
