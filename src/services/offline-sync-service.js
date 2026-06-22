import { open } from 'react-native-quick-sqlite';

export const db = open({ name: 'InspectorRjs.db' });

let initialized = false;

export function initDatabase() {
  if (initialized) return;
  try {
    db.execute(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, name TEXT)',
    );
    db.execute(`
      CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bidang TEXT,
        data TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.execute(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        object_id INTEGER NOT NULL UNIQUE,
        payload TEXT NOT NULL,
        client_name TEXT,
        object_name TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    initialized = true;
  } catch (error) {
    console.error('Gagal inisialisasi database:', error);
  }
}

export function enqueueDraft(objectId, payload, meta = {}) {
  initDatabase();
  const existing = db.execute(
    'SELECT id FROM sync_queue WHERE object_id = ?',
    [objectId],
  );
  const json = JSON.stringify(payload);
  const hasExisting = (existing.rows?.length ?? 0) > 0;

  if (hasExisting) {
    db.execute(
      `UPDATE sync_queue SET payload = ?, client_name = ?, object_name = ?, updated_at = datetime('now') WHERE object_id = ?`,
      [json, meta.clientName || null, meta.objectName || null, objectId],
    );
  } else {
    db.execute(
      `INSERT INTO sync_queue (object_id, payload, client_name, object_name) VALUES (?, ?, ?, ?)`,
      [objectId, json, meta.clientName || null, meta.objectName || null],
    );
  }
}

export function removeDraftFromQueue(objectId) {
  initDatabase();
  db.execute('DELETE FROM sync_queue WHERE object_id = ?', [objectId]);
}

export function getPendingDraftCount() {
  initDatabase();
  const result = db.execute('SELECT COUNT(*) as cnt FROM sync_queue');
  const row = result.rows?.item?.(0) ?? result.rows?.[0] ?? result.rows?._array?.[0];
  return row?.cnt ?? 0;
}

export function getPendingDrafts() {
  initDatabase();
  const result = db.execute(
    'SELECT * FROM sync_queue ORDER BY updated_at DESC',
  );
  const rows = [];
  const len = result.rows?.length ?? 0;
  for (let i = 0; i < len; i++) {
    const row =
      result.rows?.item?.(i) ?? result.rows?.[i] ?? result.rows?._array?.[i];
    if (!row) continue;
    rows.push({
      ...row,
      payload: JSON.parse(row.payload),
    });
  }
  return rows;
}

export async function processSyncQueue(saveFn) {
  initDatabase();
  const pending = getPendingDrafts();
  const results = { synced: 0, failed: 0, errors: [] };

  for (const item of pending) {
    try {
      await saveFn(item.object_id, item.payload);
      removeDraftFromQueue(item.object_id);
      results.synced += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({
        objectId: item.object_id,
        message: error?.response?.data?.message || error?.message || 'Gagal sync',
      });
    }
  }

  return results;
}

export const saveInspeksi = formData => {
  initDatabase();
  return db.execute('INSERT INTO inspections (data) VALUES (?)', [
    JSON.stringify(formData),
  ]);
};
