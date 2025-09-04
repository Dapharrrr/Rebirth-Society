import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET ?? 'change-me',
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token }: { token: Record<string, unknown> }) {
      return token;
    },
    async session({ session, token }: { session: { user?: Record<string, unknown> } & Record<string, unknown>; token: Record<string, unknown> }) {
      session.user = { ...(session.user ?? {}), ...token };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
