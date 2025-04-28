import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./lib/mongodb/userQueries";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 86400, // Set session token expiration to 1 day (86400 seconds)
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        try {
          // Validate input with Zod
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Find user by email
          // const user = await USERS_COLLECTION.findOne({ email });

          const user = await getUserByEmail(email);

          if (!user) throw new Error("No user found!");

          // Compare hashed password
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) throw new Error("Invalid credentials");

          // Ensure role exists
          if (!user.role) throw new Error("User role is missing");

          return {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            dept: user.dept,
          };
        } catch (error) {
          // Instead of returning a string, return `null` to handle the error properly.
          console.error("Authorization error:", error.message);
          return null; // Returning null prevents further processing and indicates failure
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          dept: user.dept,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});
