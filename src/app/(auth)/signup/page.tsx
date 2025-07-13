'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Card, 
  Flex, 
  Heading, 
  Text, 
  TextField, 
  Button, 
  Callout,
  RadioGroup,
  Link
} from '@radix-ui/themes';
import { 
  PersonIcon, 
  ExclamationTriangleIcon,
  CheckIcon,
  LockClosedIcon,
  EnvelopeClosedIcon
} from '@radix-ui/react-icons';
import NextLink from 'next/link';
import Loader from '@/components/ui/Loader';

export default function SignUpPage() {
  const { status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    image: ''
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.age.trim()) {
      setError('Age is required');
      setIsSubmitting(false);
      return;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18) {
      setError('Age must be at least 18');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter and one number');
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age),
        image: imageBase64,
        role: 'user' // Default role for sign up
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'authenticated') {
    return redirect('/dashboard');
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
      <Container size="2" style={{ width: '100%', maxWidth: '500px' }}>
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
              <PersonIcon color="white" width="24" height="24" />
            </Box>
            
            <Heading size="6" align="center">
              Gym Management System
            </Heading>

            <Text size="3" color="gray" align="center">
              Create your account
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

            {/* Success Message */}
            {success && (
              <Callout.Root color="green" style={{ width: '100%' }}>
                <Callout.Icon>
                  <CheckIcon />
                </Callout.Icon>
                <Callout.Text>{success}</Callout.Text>
              </Callout.Root>
            )}

            {/* Form */}
            <Box asChild style={{ width: '100%' }}>
              <form onSubmit={handleSignUp}>
                <Flex direction="column" gap="3" style={{ width: '100%' }}>
                  {/* Name Field */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Your name
                    </Text>
                    <TextField.Root
                      placeholder="John Doe"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <PersonIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  {/* Email Field */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Your email
                    </Text>
                    <TextField.Root
                      placeholder="name@company.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                    >
                      <TextField.Slot>
                        <EnvelopeClosedIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  {/* Age Field */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Your age
                    </Text>
                    <TextField.Root
                      placeholder="25"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      style={{ width: '100%' }}
                      size="3"
                      required
                      min="18"
                      max="100"
                    />
                    <Text size="1" color="gray" style={{ marginTop: '4px' }}>
                      You must be at least 18 years old to register
                    </Text>
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Your password
                    </Text>
                    <TextField.Root
                      placeholder="••••••••"
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
                    <Text size="1" color="gray" style={{ marginTop: '4px' }}>
                      Password must contain at least one uppercase letter, one lowercase letter and one number
                    </Text>
                  </Box>

                  {/* Gender Selection */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
                      Gender
                    </Text>
                    <RadioGroup.Root
                      value={formData.gender}
                      onValueChange={(value: string) => handleInputChange('gender', value)}
                    >
                      <Flex gap="4">
                        <Text as="label" size="2">
                          <Flex gap="2" align="center">
                            <RadioGroup.Item value="male" />
                            Male
                          </Flex>
                        </Text>
                        <Text as="label" size="2">
                          <Flex gap="2" align="center">
                            <RadioGroup.Item value="female" />
                            Female
                          </Flex>
                        </Text>
                      </Flex>
                    </RadioGroup.Root>
                  </Box>

                  {/* Image Upload */}
                  <Box>
                    <Text size="2" weight="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Upload your profile picture
                    </Text>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid var(--gray-7)',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="3" 
                    disabled={isSubmitting}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {isSubmitting ? 'Signing up...' : 'Sign up'}
                  </Button>

                  {/* Sign in Link */}
                  <Text size="2" color="gray" align="center">
                    Already have an account?{' '}
                    <NextLink href="/signin" passHref legacyBehavior>
                      <Link>
                        Sign in
                      </Link>
                    </NextLink>
                  </Text>
                </Flex>
              </form>
            </Box>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
