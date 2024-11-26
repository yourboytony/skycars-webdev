import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const MONGODB_URI = context.env.MONGODB_URI
const JWT_SECRET = context.env.JWT_SECRET
const DB_NAME = 'skycars'

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    const { request } = context
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Email and password are required' 
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const users = db.collection('users')

    const user = await users.findOne({ email })
    if (!user) {
      await client.close()
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials' 
      }), {
        status: 401,
        headers: corsHeaders
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      await client.close()
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials' 
      }), {
        status: 401,
        headers: corsHeaders
      })
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    await client.close()

    return new Response(JSON.stringify({
      token,
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
    console.error('Login error:', error)
    return new Response(JSON.stringify({ 
      error: 'Login failed' 
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
} 