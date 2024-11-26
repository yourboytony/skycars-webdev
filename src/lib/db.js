import { hash, compare } from 'bcrypt';
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';
import { generateToken } from './auth';

export const db = {
    // User Management
    async createUser(env, { email, password, name, role = 'user' }) {
        const password_hash = await hash(password, 10);
        
        const stmt = env.DB.prepare(`
            INSERT INTO users (email, password_hash, name, role)
            VALUES (?, ?, ?, ?)
        `).bind(email, password_hash, name, role);
        
        return stmt.run();
    },

    async getUserByEmail(env, email) {
        const stmt = env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email);
        const result = await stmt.first();
        return result;
    },

    async updateUser(env, id, updates) {
        const validFields = ['name', 'email', 'role'];
        const setFields = Object.keys(updates)
            .filter(key => validFields.includes(key))
            .map(key => `${key} = ?`);
        
        if (setFields.length === 0) return null;

        const query = `
            UPDATE users 
            SET ${setFields.join(', ')}
            WHERE id = ?
        `;

        const values = [...Object.values(updates), id];
        const stmt = env.DB.prepare(query).bind(...values);
        return stmt.run();
    },

    // Authentication
    async login(env, email, password) {
        const user = await this.getUserByEmail(env, email);
        if (!user) return null;

        const valid = await compare(password, user.password_hash);
        if (!valid) return null;

        // Create session
        const token = generateToken();
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days from now

        const stmt = env.DB.prepare(`
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, ?)
        `).bind(user.id, token, expires.toISOString());

        await stmt.run();
        await this.updateLastLogin(env, user.id);

        return { token, user: { id: user.id, email: user.email, role: user.role } };
    },

    async validateSession(env, token) {
        const stmt = env.DB.prepare(`
            SELECT users.*, sessions.expires_at
            FROM sessions 
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ? AND sessions.expires_at > datetime('now')
        `).bind(token);

        return stmt.first();
    },

    async logout(env, token) {
        const stmt = env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token);
        return stmt.run();
    },

    // Admin Functions
    async getAllUsers(env, { page = 1, limit = 10 } = {}) {
        const offset = (page - 1) * limit;
        const stmt = env.DB.prepare(`
            SELECT id, email, name, role, created_at, last_login 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `).bind(limit, offset);

        const countStmt = env.DB.prepare('SELECT COUNT(*) as total FROM users');
        
        const [users, count] = await Promise.all([
            stmt.all(),
            countStmt.first()
        ]);

        return {
            users: users.results,
            total: count.total,
            pages: Math.ceil(count.total / limit)
        };
    },

    async updateLastLogin(env, userId) {
        const stmt = env.DB.prepare(`
            UPDATE users 
            SET last_login = datetime('now') 
            WHERE id = ?
        `).bind(userId);
        
        return stmt.run();
    }
}; 