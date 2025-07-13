'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  Button, 
  Flex, 
  Text, 
  TextField, 
  Tabs,
  Box,
  Callout,
  Select,
  Grid
} from '@radix-ui/themes';
import { ExclamationTriangleIcon, CheckIcon } from '@radix-ui/react-icons';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'admin' | 'trainer' | 'user',
    
    // Additional fields for students
    age: 18,
    weight: 50,
    height: 170,
    gender: 'male' as 'male' | 'female',
    goal: 'get_fitter' as 'gain_weight' | 'lose_weight' | 'get_fitter' | 'get_stronger' | 'get_healthier',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        onOpenChange(false);
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const registrationPayload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        
        // Include additional fields for students
        ...(registerData.role === 'user' && {
          age: registerData.age,
          weight: registerData.weight,
          height: registerData.height,
          gender: registerData.gender,
          goal: registerData.goal,
          level: registerData.level
        })
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now log in.');
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'admin',
          age: 18,
          weight: 50,
          height: 170,
          gender: 'male',
          goal: 'get_fitter',
          level: 'beginner'
        });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = registerData.role === 'user';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
        <Dialog.Title>Access GymFlow</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Sign in to your account or create a new one to get started.
        </Dialog.Description>

        <Tabs.Root defaultValue="login">
          <Tabs.List>
            <Tabs.Trigger value="login">Sign In</Tabs.Trigger>
            <Tabs.Trigger value="register">Create Account</Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            {error && (
              <Callout.Root color="red" mb="3">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            {success && (
              <Callout.Root color="green" mb="3">
                <Callout.Icon>
                  <CheckIcon />
                </Callout.Icon>
                <Callout.Text>{success}</Callout.Text>
              </Callout.Root>
            )}

            <Tabs.Content value="login">
              <form onSubmit={handleLogin}>
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="label" size="2" mb="1" weight="bold">
                      Email
                    </Text>
                    <TextField.Root
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" mb="1" weight="bold">
                      Password
                    </Text>
                    <TextField.Root
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </Box>

                  <Button type="submit" loading={isLoading} style={{ width: '100%' }}>
                    Sign In
                  </Button>
                </Flex>
              </form>
            </Tabs.Content>

            <Tabs.Content value="register">
              <form onSubmit={handleRegister}>
                <Flex direction="column" gap="4">
                  <Grid columns="2" gap="3">
                    <Box>
                      <Text as="label" size="2" mb="1" weight="bold">
                        Full Name
                      </Text>
                      <TextField.Root
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </Box>

                    <Box>
                      <Text as="label" size="2" mb="1" weight="bold">
                        Role
                      </Text>
                      <Select.Root
                        value={registerData.role}
                        onValueChange={(value: 'admin' | 'trainer' | 'user') => 
                          setRegisterData({ ...registerData, role: value })
                        }
                      >
                        <Select.Trigger placeholder="Select role" />
                        <Select.Content>
                          <Select.Item value="admin">Admin</Select.Item>
                          <Select.Item value="trainer">Trainer</Select.Item>
                          <Select.Item value="user">Student</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </Grid>

                  <Box>
                    <Text as="label" size="2" mb="1" weight="bold">
                      Email
                    </Text>
                    <TextField.Root
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </Box>

                  <Grid columns="2" gap="3">
                    <Box>
                      <Text as="label" size="2" mb="1" weight="bold">
                        Password
                      </Text>
                      <TextField.Root
                        type="password"
                        placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </Box>

                    <Box>
                      <Text as="label" size="2" mb="1" weight="bold">
                        Confirm Password
                      </Text>
                      <TextField.Root
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                    </Box>
                  </Grid>

                  {isStudent && (
                    <>
                      <Text size="3" weight="bold" style={{ marginTop: '16px' }}>
                        Student Information
                      </Text>
                      
                      <Grid columns="3" gap="3">
                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Age
                          </Text>
                          <TextField.Root
                            type="number"
                            min="18"
                            value={registerData.age.toString()}
                            onChange={(e) => setRegisterData({ ...registerData, age: parseInt(e.target.value) || 18 })}
                            required
                          />
                        </Box>

                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Weight (kg)
                          </Text>
                          <TextField.Root
                            type="number"
                            min="30"
                            value={registerData.weight.toString()}
                            onChange={(e) => setRegisterData({ ...registerData, weight: parseInt(e.target.value) || 50 })}
                          />
                        </Box>

                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Height (cm)
                          </Text>
                          <TextField.Root
                            type="number"
                            min="100"
                            value={registerData.height.toString()}
                            onChange={(e) => setRegisterData({ ...registerData, height: parseInt(e.target.value) || 170 })}
                          />
                        </Box>
                      </Grid>

                      <Grid columns="3" gap="3">
                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Gender
                          </Text>
                          <Select.Root
                            value={registerData.gender}
                            onValueChange={(value: 'male' | 'female') => 
                              setRegisterData({ ...registerData, gender: value })
                            }
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="male">Male</Select.Item>
                              <Select.Item value="female">Female</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Goal
                          </Text>
                          <Select.Root
                            value={registerData.goal}
                            onValueChange={(value: 'gain_weight' | 'lose_weight' | 'get_fitter' | 'get_stronger' | 'get_healthier') => 
                              setRegisterData({ ...registerData, goal: value })
                            }
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="gain_weight">Gain Weight</Select.Item>
                              <Select.Item value="lose_weight">Lose Weight</Select.Item>
                              <Select.Item value="get_fitter">Get Fitter</Select.Item>
                              <Select.Item value="get_stronger">Get Stronger</Select.Item>
                              <Select.Item value="get_healthier">Get Healthier</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        <Box>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Level
                          </Text>
                          <Select.Root
                            value={registerData.level}
                            onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                              setRegisterData({ ...registerData, level: value })
                            }
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="beginner">Beginner</Select.Item>
                              <Select.Item value="intermediate">Intermediate</Select.Item>
                              <Select.Item value="advanced">Advanced</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>
                      </Grid>
                    </>
                  )}

                  <Button type="submit" loading={isLoading} style={{ width: '100%', marginTop: '16px' }}>
                    Create Account
                  </Button>
                </Flex>
              </form>
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
