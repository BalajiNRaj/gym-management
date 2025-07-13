'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Card, 
  Flex, 
  Heading, 
  TextField, 
  Button, 
  Callout
} from '@radix-ui/themes';
import { 
  LockClosedIcon, 
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';

function PasswordResetForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { password, confirmPassword } = formData;

    if (!password) {
      setError('Please enter your password');
      setIsSubmitting(false);
      return;
    }

    if (!confirmPassword) {
      setError('Please enter your password again');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword, token }),
      });

      if (res.ok) {
        alert('Password reset successfully! Redirecting to sign in...');
        router.push('/signin');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Something went wrong');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

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
              Choose a new password
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
              <form onSubmit={handleNewPassword}>
                <Flex direction="column" gap="3" style={{ width: '100%' }}>
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

                  {/* Confirm Password Field */}
                  <Box>
                    <TextField.Root
                      placeholder="Confirm Password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <LockClosedIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="3" 
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Resetting...' : 'Create New Password'}
                  </Button>
                </Flex>
              </form>
            </Box>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordResetForm />
    </Suspense>
  );
}
