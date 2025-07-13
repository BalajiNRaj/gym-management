declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'trainer' | 'user';
      accountNumber: string;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'trainer' | 'user';
    accountNumber: string;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'trainer' | 'user';
    accountNumber: string;
    isAdmin: boolean;
  }
}
