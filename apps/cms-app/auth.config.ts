import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import apiClient from '@/shared/lib/apiClient';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string | null;
      organizationId: string | null;
      accessToken: string;
    } | null;
  }
}
const authSecret = process.env.JWT_SECRET;

type MeResponse = {
  sub: string;
  name: string;
  email: string;
  organizationId: string | null;
  role: string | null;
};

type LoginResponse = {
  access_token?: string;
};

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        try {
          const response = await apiClient.post<LoginResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const loginBody = response.data;
          const setCookieRaw = response.headers['set-cookie'];
          const setCookie =
            (Array.isArray(setCookieRaw)
              ? setCookieRaw.join('; ')
              : setCookieRaw) ?? '';
          const cookieTokenMatch = setCookie.match(/CMS_ACCESS_TOKEN=([^;]+)/);
          const authToken = loginBody?.access_token ?? cookieTokenMatch?.[1];

          if (!authToken) {
            return null;
          }

          const meResponse = await apiClient.get<{ data: MeResponse }>(
            '/auth/me',
            {
              headers: {
                Cookie: `CMS_ACCESS_TOKEN=${authToken}`,
              },
            },
          );

          const me = meResponse.data.data;

          return {
            id: me.sub,
            name: me.name,
            email: me.email,
            organizationId: me.organizationId,
            role: me.role,
            accessToken: authToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.organizationId = (
          user as { organizationId?: string | null }
        ).organizationId;
        token.role = (user as { role?: string | null }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }

      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.organizationId = token.organizationId as string | null;
        session.user.role = token.role as string | null;
        session.user.accessToken = token.accessToken as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: authSecret,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 día
    updateAge: 60 * 60 * 20, // 20 horas
  },
};
