import NextAuth from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const GOOGLE_ID = process.env.GOOGLE_ID ?? '';
const GOOGLE_SECRET = process.env.GOOGLE_SECRET ?? '';

console.log(process.env.GITHUB_ID, process.env.GITHUB_SECRET);

const providers: Provider[] = [
  GoogleProvider({
    clientId: GOOGLE_ID,
    clientSecret: GOOGLE_SECRET,
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_ID ?? '',
    clientSecret: process.env.GITHUB_SECRET ?? '',
  }),
];

const options: NextAuthOptions = { providers };

const handler = NextAuth(options);
export { handler as GET, handler as POST };
