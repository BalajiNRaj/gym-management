import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Gym Management System',
  description: 'Sign in or sign up to access the Gym Management System',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
