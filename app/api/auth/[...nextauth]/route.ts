import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? 'change-me',
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }: { token: any; account?: any; profile?: any }) {
      // attach access token from provider
      if (account) token.accessToken = account.access_token;
      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // expose token info in session
      session.accessToken = token.accessToken;
      if (token.name) session.user = { ...session.user, name: token.name, email: token.email, image: token.picture };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
