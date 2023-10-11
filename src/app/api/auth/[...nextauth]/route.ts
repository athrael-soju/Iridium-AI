import NextAuth from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

console.log('Google ID:', process.env.GOOGLE_ID);
console.log('Google Secret:', process.env.GOOGLE_SECRET);

const GOOGLE_ID = process.env.GOOGLE_ID ?? '';
const GOOGLE_SECRET = process.env.GOOGLE_SECRET ?? '';

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };
