// Session user type for NextAuth
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: 'admin' | 'trainer' | 'user';
  accountNumber: string;
  isAdmin: boolean;
}


