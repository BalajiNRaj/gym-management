'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Card, 
  Flex, 
  Heading, 
  TextField, 
  Button, 
  Callout,
  Link
} from '@radix-ui/themes';
import { 
  LockClosedIcon, 
  ExclamationTriangleIcon,
  PersonIcon
} from '@radix-ui/react-icons';
import NextLink from 'next/link';
import Loader from '@/components/ui/Loader';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--gray-1) 0%, var(--gray-3) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <Container size="1" style={{ width: '100%', maxWidth: '400px' }}>
        <Card size="3" style={{ padding: '32px' }}>
          <Flex direction="column" align="center" gap="4">
            {/* Header */}
            <Box style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--accent-9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LockClosedIcon color="white" width="24" height="24" />
            </Box>
            
            <Heading size="6" align="center">
              Sign in
            </Heading>

            {/* Error Message */}
            {error && (
              <Callout.Root color="red" style={{ width: '100%' }}>
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            {/* Form */}
            <Box asChild style={{ width: '100%' }}>
              <form onSubmit={handleSignIn}>
                <Flex direction="column" gap="3" style={{ width: '100%' }}>
                  {/* Email Field */}
                  <Box>
                    <TextField.Root
                      placeholder="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <PersonIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <TextField.Root
                      placeholder="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <LockClosedIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  {/* Forgot Password Link */}
                  <Flex justify="start">
                    <NextLink href="/forgot-password" passHref legacyBehavior>
                      <Link size="2">
                        Forgot password?
                      </Link>
                    </NextLink>
                  </Flex>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="3" 
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </Flex>
              </form>
            </Box>

            {/* Test User Buttons */}
            {/* <Box style={{ width: '100%' }}>
              <Text size="2" color="gray" style={{ marginBottom: '8px', display: 'block' }}>
                Test Users:
              </Text>
              <Flex direction="column" gap="2">
                <Button
                  onClick={() => {
                    setTestUser({
                      email: 'admin@gym.com',
                      password: '123456Admin',
                    });
                    setFormData({ email: '', password: '' }); // Clear form data
                  }}
                  size="2"
                  variant="outline"
                  style={{ width: '100%' }}
                  type="button"
                >
                  Role as Admin
                </Button>
                <Button
                  onClick={() => {
                    setTestUser({
                      email: 'trainer@gym.com',
                      password: '123456Trainer',
                    });
                    setFormData({ email: '', password: '' }); // Clear form data
                  }}
                  size="2"
                  variant="outline"
                  style={{ width: '100%' }}
                  type="button"
                >
                  Role as Trainer
                </Button>
                <Button
                  onClick={() => {
                    setTestUser({
                      email: 'user@gym.com',
                      password: '123456User',
                    });
                    setFormData({ email: '', password: '' }); // Clear form data
                  }}
                  size="2"
                  variant="outline"
                  style={{ width: '100%' }}
                  type="button"
                >
                  Role as User
                </Button>
              </Flex>
            </Box> */}
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
