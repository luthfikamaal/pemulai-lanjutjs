import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Extend User and AdapterUser to include avatar
declare module "next-auth" {
  interface Session {
    user: {
      avatar?: string | null;
      id: string;
      name: string;
      email: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    token: string;
    avatar?: string | null;
  }
}
declare module "next-auth/adapters" {
  interface AdapterUser {
    avatar?: string | null;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        const token = uuidv4().toString();
        await prisma.user.update({
          where: { email: credentials.email },
          data: { token: token },
        });
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          avatar: user.avatar ?? null,
          token: user.token ?? uuidv4(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          const randomUuid = await randomUUID();
          const password = await bcrypt.hash(randomUUID.toString(), 10);
          await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              password: password,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
        token.avatar = user.avatar || null;
      }

      if (account?.provider == "google" && token.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (existingUser) {
          const userToken = await uuidv4().toString();

          await prisma.user.update({
            where: { email: token.email },
            data: { token: userToken },
          });

          token.id = String(existingUser.id);
          token.name = existingUser.name;
          token.email = existingUser.email;
          token.token = userToken;
          token.avatar = existingUser.avatar || null;
        }
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          token: token.token as string,
          avatar: token.avatar as string | null,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/?from_login=true`;
      }
      return url;
    },
  },
} satisfies NextAuthOptions;

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
