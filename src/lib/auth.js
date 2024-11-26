import { generateSecret } from './utils';

export function generateToken() {
    return generateSecret(32);
}

export async function requireAuth(request, env) {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) throw new Error('Authentication required');

    const session = await db.validateSession(env, token);
    if (!session) throw new Error('Invalid or expired session');

    return session;
}

export async function requireAdmin(request, env) {
    const session = await requireAuth(request, env);
    if (session.role !== 'admin') throw new Error('Admin access required');
    return session;
} 