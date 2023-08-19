import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { pool } from '@/lib/pg'

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const { rows } = await pool.query(
        `SELECT * FROM "user" WHERE email = $1`,
        [user.email]
      )

      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO "user" (email, name) VALUES ($1, $2)`,
          [user.email, profile.name]
        )
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  },
}

export default NextAuth(authOptions)