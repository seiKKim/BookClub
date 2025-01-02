import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 제공해주세요.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("등록되지 않은 사용자입니다.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("잘못된 비밀번호입니다.");
        }

        return {
          id: user.userId.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string, // 강제 타입 변환
          role: token.role as string, // 강제 타입 변환
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
