import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Debug information
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

// At the top of the file, log the full connection string (with password redacted)
const connectionString = process.env.DATABASE_URL || '';
const redactedConnectionString = connectionString.replace(
  /mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/,
  'mongodb$1://*****:*****@'
);
console.log('MongoDB Connection String:', redactedConnectionString);

// Modify the connection test to handle errors better:
try {
  // Test database connection before initializing NextAuth
  await prisma.$connect();
  console.log("Successfully connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  // Don't throw the error, just log it
}

// Validation function for credentials
const validateCredentials = async (credentials: Record<"email" | "password", string> | undefined) => {
  if (!credentials?.email || !credentials?.password) {
    console.log("Missing credentials");
    return null;
  }

  try {
    console.log(`Trying to authenticate: ${credentials.email}`);
    
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      console.log(`User not found: ${credentials.email}`);
      return null;
    }

    // Compare password
    const passwordMatch = await compare(credentials.password, user.password);
    console.log(`Password match: ${passwordMatch}`);

    // If password doesn't match, return null
    if (!passwordMatch) {
      return null;
    }

    // Return user object (without the password!)
    return {
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: user.role || "user",
    };
  } catch (error) {
    console.error("Database validation error:", error);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email/Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Temporary fallback admin login for development
          if (process.env.NODE_ENV === 'development' && 
              credentials?.email === 'Trilearn@admin.com' && 
              credentials?.password === 'Trilearnadmin') {
            console.log("Using fallback admin login");
            return {
              id: "admin-temp",
              name: "Admin User (Temp)",
              email: "Trilearn@admin.com",
              role: "admin",
              planType: "business"
            };
          }
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // Find the user
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email 
            }
          });

          if (!user) {
            console.log(`User not found: ${credentials.email}`);
            throw new Error("Invalid email or password");
          }

          // Check password
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log(`Invalid password for user: ${credentials.email}`);
            throw new Error("Invalid email or password");
          }

          console.log(`Successfully authenticated: ${credentials.email}`);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            planType: user.planType || 'free'
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    }),
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin',
      credentials: {},
      async authorize() {
        // Return admin user object with planType
        return {
          id: "admin",
          name: "Admin User",
          email: "admin@trilearn.com",
          role: "admin",
          planType: "business"
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  debug: true,
  callbacks: {
    async session({ session, token }) {
      // Add user id and role to session
      session.user.id = token.id;
      session.user.role = token.role;
      
      // Add plan info to session
      session.user.planType = token.planType;
      
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        
        // Safely handle planType - avoid undefined errors
        if (typeof user.planType === 'string') {
          token.planType = user.planType;
        } else {
          // Default to free plan if not specified
          token.planType = 'free';
        }
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt:", { user, account, profile });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-for-development',
};

// Make sure you have a consistent secret
console.log("NEXTAUTH_SECRET is set:", !!process.env.NEXTAUTH_SECRET);

export default NextAuth(authOptions);