import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const MONGODB_URI = context.env.MONGODB_URI
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
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ 
        error: 'All fields are required' 
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const users = db.collection('users')

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      await client.close()
      return new Response(JSON.stringify({ 
        error: 'Email already registered' 
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      role: 'user'
    })

    await client.close()

    return new Response(JSON.stringify({
      message: 'Registration successful',
      userId: result.insertedId
    }), {
      status: 201,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Registration error:', error)
    return new Response(JSON.stringify({ 
      error: 'Registration failed' 
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