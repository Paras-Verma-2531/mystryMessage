import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/dbConnect";
import User from "@/models/user";
connectDb();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) throw new Error("No User found with such credentials");
          if (!user.isVerified) throw new Error("Verify your account first");
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordMatch) throw new Error("Incorrect Password");
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  //these pages will be taken care by NextAuth
  pages: {
    signIn: "/signIn", //url : endpoint
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    //user :: {is the user send the by us in the provide }
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
