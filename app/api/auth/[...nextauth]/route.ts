import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET ?? 'change-me',
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };
