import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

const MONGODB_URI = 'mongodb+srv://skycars-admin:mrVDdv9lAVnTbNrV@skycars.1ceyw.mongodb.net/?retryWrites=true&w=majority&appName=SkyCars'
const JWT_SECRET = 'skycars-secret-key-2024'
const DB_NAME = 'skycars'

export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const { request } = context
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        error: 'No token provided' 
      }), {
        status: 401,
        headers: corsHeaders
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const users = db.collection('users')

    const user = await users.findOne({ email: decoded.email })
    await client.close()

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'User not found' 
      }), {
        status: 404,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }), {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return new Response(JSON.stringify({ 
      error: 'Invalid token' 
    }), {
      status: 401,
      headers: corsHeaders
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
} 