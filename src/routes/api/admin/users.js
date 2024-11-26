import { db } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export async function GET({ request, env }) {
    try {
        await requireAdmin(request, env);
        
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        const users = await db.getAllUsers(env, { page, limit });
        
        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request, env }) {
    try {
        await requireAdmin(request, env);
        const userData = await request.json();
        
        const user = await db.createUser(env, userData);
        
        return new Response(JSON.stringify(user), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 