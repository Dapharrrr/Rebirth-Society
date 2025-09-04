import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET ?? 'change-me',
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token }: { token: any }) {
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) session.user = { ...session.user, ...token };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
