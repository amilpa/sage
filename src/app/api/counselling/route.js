

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getToken } from 'next-auth/jwt'

import { pool } from "@/lib/pg";


export async function GET(Request) {

    // Database access
    const { rows } = await pool.query("SELECT * FROM counselling_request");

    return new Response(JSON.stringify(rows))
}


export async function POST(Request) {


    const session = await getServerSession(authOptions)
    const token = await getToken({ req: Request, authOptions: authOptions })

    const { subject } = await Request.json()

    await pool.query("INSERT INTO counselling_request (subject, user_id) VALUES ($1, $2) RETURNING *", [subject, session.uid]);


    return new Response("dfafsd")
}