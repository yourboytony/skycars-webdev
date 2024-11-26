-- Drop tables if they exist (useful for schema updates)
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Chat history table
CREATE TABLE chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- User sessions table
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_chat_user_id ON chats(user_id);
CREATE INDEX idx_session_token ON sessions(token);
CREATE INDEX idx_session_user ON sessions(user_id);

-- Create initial admin user (password: Tonyplayz2023$)
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'nigroan67@gmail.com', 
    '$2b$10$YourHashedPasswordHere',  -- We'll generate this properly
    'Admin User',
    'admin'
);