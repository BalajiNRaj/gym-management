// Session user type for NextAuth
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  accountNumber?: string;
  isAdmin?: boolean;
}

// Extend the default NextAuth session type
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  
  interface User {
    id: string;
    role?: string;
    accountNumber?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accountNumber?: string;
    isAdmin?: boolean;
  }
}
