'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Card, 
  Flex, 
  Heading, 
  Text, 
  TextField, 
  Button, 
  Callout
} from '@radix-ui/themes';
import { 
  LockClosedIcon, 
  ExclamationTriangleIcon,
  EnvelopeClosedIcon
} from '@radix-ui/react-icons';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  const handleForget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        router.push('/forgot-password/success');
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
              Forgot Password
            </Heading>

            <Text size="3" color="gray" align="center" style={{ lineHeight: '1.5' }}>
              Enter your email address and we will send you<br />
              a link to reset your password.
            </Text>

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
              <form onSubmit={handleForget}>
                <Flex direction="column" gap="3" style={{ width: '100%' }}>
                  {/* Email Field */}
                  <Box>
                    <TextField.Root
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <EnvelopeClosedIcon height="16" width="16" />
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
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
