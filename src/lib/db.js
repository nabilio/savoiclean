// Couche base de données : MySQL en production (Hostinger), SQLite local pour les tests.
import 'server-only';

const g = globalThis;
if (!g.__alpi) g.__alpi = { ready: null, driver: null, pool: null, sqlite: null };
const S = g.__alpi;

function wantsMysql() {
  return Boolean(process.env.DB_NAME);
}

async function connect() {
  if (S.driver) return;
  if (wantsMysql()) {
    const mysql = (await import('mysql2/promise')).default;
    S.pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 8,
      charset: 'utf8mb4',
      timezone: 'Z',
      dateStrings: true,
    });
    S.driver = 'mysql';
    return;
  }
  if (process.env.NODE_ENV === 'production' && process.env.USE_SQLITE !== '1') {
    throw new Error('Base de données non configurée : définissez DB_HOST, DB_NAME, DB_USER et DB_PASSWORD.');
  }
  const { DatabaseSync } = await import('node:sqlite');
  const fs = await import('node:fs');
  fs.mkdirSync('data', { recursive: true });
  S.sqlite = new DatabaseSync(process.env.SQLITE_PATH || 'data/dev.db');
  S.sqlite.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  S.driver = 'sqlite';
}

function clean(params = []) {
  return params.map((p) => {
    if (p === undefined) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    return p;
  });
}

function normalizeRow(row) {
  if (!row) return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v instanceof Uint8Array && !Buffer.isBuffer(v) ? Buffer.from(v) : v;
  }
  return out;
}

const TABLES = [
  ['settings', `k VARCHAR(100) PRIMARY KEY, v LONGTEXT`],
  [
    'users',
    `{ID}, email VARCHAR(190) NOT NULL UNIQUE, pass_hash VARCHAR(255) NOT NULL,
     totp_secret_enc TEXT, totp_enabled TINYINT NOT NULL DEFAULT 0, totp_last_step BIGINT NOT NULL DEFAULT 0,
     recovery TEXT, session_version INT NOT NULL DEFAULT 1, created_at VARCHAR(19) NOT NULL, last_login VARCHAR(19)`,
  ],
  ['rate_limits', `k VARCHAR(190) PRIMARY KEY, n INT NOT NULL, reset_at BIGINT NOT NULL`],
  [
    'audit',
    `{ID}, user_id INT, email VARCHAR(190), action VARCHAR(60) NOT NULL, detail VARCHAR(255), ip VARCHAR(64), created_at VARCHAR(19) NOT NULL`,
  ],
  [
    'services',
    `{ID}, slug VARCHAR(120) NOT NULL UNIQUE, name VARCHAR(190) NOT NULL, short TEXT, body LONGTEXT,
     meta_title VARCHAR(190), meta_description VARCHAR(300), icon VARCHAR(40), audience VARCHAR(20),
     keywords TEXT, image_id INT, sort INT NOT NULL DEFAULT 0, visible TINYINT NOT NULL DEFAULT 1`,
  ],
  [
    'zones',
    `{ID}, slug VARCHAR(120) NOT NULL UNIQUE, name VARCHAR(190) NOT NULL, dept VARCHAR(40), kind VARCHAR(20),
     blurb TEXT, body LONGTEXT, sort INT NOT NULL DEFAULT 0, visible TINYINT NOT NULL DEFAULT 1`,
  ],
  [
    'faqs',
    `{ID}, question VARCHAR(300) NOT NULL, answer TEXT NOT NULL, sort INT NOT NULL DEFAULT 0, visible TINYINT NOT NULL DEFAULT 1`,
  ],
  [
    'posts',
    `{ID}, slug VARCHAR(160) NOT NULL UNIQUE, title VARCHAR(220) NOT NULL, excerpt TEXT, body LONGTEXT,
     meta_description VARCHAR(300), published TINYINT NOT NULL DEFAULT 0, published_at VARCHAR(10)`,
  ],
  [
    'realisations',
    `{ID}, title VARCHAR(190) NOT NULL, description TEXT, service VARCHAR(120), place VARCHAR(120),
     image_id INT, sort INT NOT NULL DEFAULT 0, visible TINYINT NOT NULL DEFAULT 1`,
  ],
  [
    'slides',
    `{ID}, title VARCHAR(190), alt VARCHAR(255), image_id INT, image_url VARCHAR(255), sort INT NOT NULL DEFAULT 0, visible TINYINT NOT NULL DEFAULT 1`,
  ],
  ['media', `{ID}, mime VARCHAR(60) NOT NULL, name VARCHAR(190), data {BLOB} NOT NULL, created_at VARCHAR(19) NOT NULL`],
  [
    'clients',
    `{ID}, kind VARCHAR(20) NOT NULL DEFAULT 'pro', name VARCHAR(190) NOT NULL, company VARCHAR(190), email VARCHAR(190),
     phone VARCHAR(40), address VARCHAR(255), postal_code VARCHAR(12), city VARCHAR(120), siret VARCHAR(20),
     vat_number VARCHAR(30), notes TEXT, created_at VARCHAR(19) NOT NULL`,
  ],
  [
    'documents',
    `{ID}, type VARCHAR(10) NOT NULL, number VARCHAR(30) NOT NULL UNIQUE, client_id INT, status VARCHAR(20) NOT NULL,
     issue_date VARCHAR(10) NOT NULL, due_date VARCHAR(10), title VARCHAR(255), items LONGTEXT NOT NULL,
     vat_regime VARCHAR(12) NOT NULL DEFAULT 'normal', total_ht INT NOT NULL DEFAULT 0, total_vat INT NOT NULL DEFAULT 0,
     total_ttc INT NOT NULL DEFAULT 0, notes TEXT, payment_method VARCHAR(40), paid_at VARCHAR(10),
     source_id INT, created_at VARCHAR(19) NOT NULL, updated_at VARCHAR(19) NOT NULL`,
  ],
  [
    'leads',
    `{ID}, name VARCHAR(190) NOT NULL, company VARCHAR(190), email VARCHAR(190), phone VARCHAR(40),
     service VARCHAR(190), zone VARCHAR(190), message TEXT, source VARCHAR(60), status VARCHAR(20) NOT NULL DEFAULT 'nouveau',
     notes TEXT, created_at VARCHAR(19) NOT NULL`,
  ],
];

function ddl(driver) {
  return TABLES.map(([name, cols]) => {
    const id = driver === 'mysql' ? 'id INT AUTO_INCREMENT PRIMARY KEY' : 'id INTEGER PRIMARY KEY AUTOINCREMENT';
    const blob = driver === 'mysql' ? 'LONGBLOB' : 'BLOB';
    const body = cols.replace('{ID}', id).replace('{BLOB}', blob);
    const tail = driver === 'mysql' ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';
    return `CREATE TABLE IF NOT EXISTS ${name} (${body})${tail}`;
  });
}

async function rawQuery(sql, params) {
  if (S.driver === 'mysql') {
    const [rows] = await S.pool.query(sql, clean(params));
    return rows;
  }
  return S.sqlite.prepare(sql).all(...clean(params)).map(normalizeRow);
}

async function rawRun(sql, params) {
  if (S.driver === 'mysql') {
    const [res] = await S.pool.query(sql, clean(params));
    return { insertId: Number(res.insertId || 0), affectedRows: Number(res.affectedRows || 0) };
  }
  const r = S.sqlite.prepare(sql).run(...clean(params));
  return { insertId: Number(r.lastInsertRowid || 0), affectedRows: Number(r.changes || 0) };
}

export async function ready() {
  if (!S.ready) {
    S.ready = (async () => {
      await connect();
      for (const stmt of ddl(S.driver)) await rawRun(stmt, []);
      // migration : photo propre à chaque service (bases créées avant cette colonne)
      try {
        await rawRun('ALTER TABLE services ADD COLUMN image_id INT', []);
      } catch {}
      const { seedIfEmpty } = await import('./seed.js');
      await seedIfEmpty({ query: rawQuery, run: rawRun });
    })().catch((e) => {
      S.ready = null;
      throw e;
    });
  }
  return S.ready;
}

export async function q(sql, params = []) {
  await ready();
  return rawQuery(sql, params);
}

export async function one(sql, params = []) {
  const rows = await q(sql, params);
  return rows[0] || null;
}

export async function run(sql, params = []) {
  await ready();
  return rawRun(sql, params);
}

export function nowStamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export function todayStr() {
  // Date du jour en Europe/Paris, format AAAA-MM-JJ
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris' }).format(new Date());
}
