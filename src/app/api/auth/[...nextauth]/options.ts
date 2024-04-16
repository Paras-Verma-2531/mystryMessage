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
};
