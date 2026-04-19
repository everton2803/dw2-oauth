const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new sqlite3.Database(dbPath);

// Inicializar banco de dados com tabela de usuários
const initDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        googleId TEXT UNIQUE NOT NULL,
        displayName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        photo TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);
  });
};

// Funções para manipular usuários
const findOrCreateUser = (googleId, displayName, email, photo) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE googleId = ?', [googleId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        // Atualizar lastLogin
        db.run('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', [row.id], (err) => {
          if (err) console.error('Erro ao atualizar lastLogin:', err);
          resolve(row);
        });
      } else {
        // Criar novo usuário
        db.run(
          'INSERT INTO users (googleId, displayName, email, photo) VALUES (?, ?, ?, ?)',
          [googleId, displayName, email, photo],
          function (err) {
            if (err) {
              reject(err);
              return;
            }
            db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          }
        );
      }
    });
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, displayName, email, photo, createdAt, lastLogin FROM users', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Funções para gerenciar sessões
const createSession = (userId, token, expiryTime) => {
  return new Promise((resolve, reject) => {
    const expiresAt = new Date(Date.now() + expiryTime);
    db.run(
      'INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)',
      [userId, token, expiresAt.toISOString()],
      function (err) {
        if (err) reject(err);
        else resolve({ sessionId: this.lastID, token });
      }
    );
  });
};

const getSessionByToken = (token) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT s.*, u.* FROM sessions s JOIN users u ON s.userId = u.id WHERE s.token = ? AND s.expiresAt > CURRENT_TIMESTAMP',
      [token],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

const deleteSession = (token) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM sessions WHERE token = ?', [token], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

const getActiveSessionsCount = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM sessions WHERE expiresAt > CURRENT_TIMESTAMP', (err, row) => {
      if (err) reject(err);
      else resolve(row?.count || 0);
    });
  });
};

module.exports = {
  db,
  initDatabase,
  findOrCreateUser,
  getUserById,
  getAllUsers,
  getUserByEmail,
  createSession,
  getSessionByToken,
  deleteSession,
  getActiveSessionsCount,
};
