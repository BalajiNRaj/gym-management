'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Flex, Heading, Text, Button, Card, Grid, Badge } from '@radix-ui/themes';
import { 
  PersonIcon, 
  BarChartIcon, 
  CalendarIcon, 
  GearIcon,
  MobileIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckIcon
} from '@radix-ui/react-icons';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--gray-1) 0%, var(--gray-3) 100%)' }}>
      {/* Header */}
      <Box style={{ borderBottom: '1px solid var(--gray-6)', background: 'white' }}>
        <Container size="4" style={{ padding: '16px 0' }}>
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'var(--accent-9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PersonIcon color="white" width="20" height="20" />
              </Box>
              <Heading size="6" style={{ color: 'var(--gray-12)' }}>
                GymFlow
              </Heading>
            </Flex>
            <Flex gap="3" align="center">
              {session ? (
                <>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>
                    Welcome, {session.user?.name}
                  </Text>
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/signin')}>
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted}>
                    Get Started
                    <ArrowRightIcon />
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container size="4" style={{ padding: '80px 0' }}>
        <Flex direction="column" align="center" gap="6" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Badge size="2" color="blue" variant="soft">
            Complete Gym Management Solution
          </Badge>
          <Heading size="9" style={{ color: 'var(--gray-12)', lineHeight: 1.2 }}>
            Streamline Your Gym Operations with Smart Management
          </Heading>
          <Text size="5" style={{ color: 'var(--gray-11)', lineHeight: 1.6, maxWidth: '600px' }}>
            Everything you need to manage members, trainers, attendance, payments, and more. 
            Built for modern fitness centers and gyms of all sizes.
          </Text>
          <Flex gap="3" style={{ marginTop: '20px' }}>
            <Button size="4" onClick={handleGetStarted}>
              Start Managing
              <ArrowRightIcon />
            </Button>
            <Button size="4" variant="outline">
              Watch Demo
            </Button>
          </Flex>
        </Flex>
      </Container>

      {/* Features Section */}
      <Container size="4" style={{ padding: '80px 0' }}>
        <Box style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Heading size="8" style={{ color: 'var(--gray-12)', marginBottom: '16px' }}>
            Everything You Need
          </Heading>
          <Text size="4" style={{ color: 'var(--gray-11)' }}>
            Comprehensive tools to run your gym efficiently
          </Text>
        </Box>

        <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="6">
          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--blue-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <PersonIcon color="var(--blue-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Member Management</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Manage member profiles, subscriptions, and track their fitness journey with ease.
            </Text>
          </Card>

          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--green-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CalendarIcon color="var(--green-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Attendance Tracking</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Real-time attendance monitoring with automated check-ins and comprehensive reports.
            </Text>
          </Card>

          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--orange-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <BarChartIcon color="var(--orange-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Analytics & Reports</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Detailed insights into gym performance, revenue tracking, and member engagement.
            </Text>
          </Card>

          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--purple-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <GearIcon color="var(--purple-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Equipment Management</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Track equipment usage, maintenance schedules, and optimize your gym floor layout.
            </Text>
          </Card>

          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--cyan-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MobileIcon color="var(--cyan-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Mobile Ready</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Access your gym management system anywhere with our responsive web interface.
            </Text>
          </Card>

          <Card style={{ padding: '32px', textAlign: 'center' }}>
            <Box style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'var(--red-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <LockClosedIcon color="var(--red-9)" width="24" height="24" />
            </Box>
            <Heading size="5" style={{ marginBottom: '12px' }}>Secure & Reliable</Heading>
            <Text style={{ color: 'var(--gray-11)' }}>
              Bank-level security with automated backups and 99.9% uptime guarantee.
            </Text>
          </Card>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box style={{ background: 'white', borderTop: '1px solid var(--gray-6)' }}>
        <Container size="4" style={{ padding: '80px 0' }}>
          <Grid columns={{ initial: '1', md: '2' }} gap="8" align="center">
            <Box>
              <Heading size="7" style={{ marginBottom: '24px', color: 'var(--gray-12)' }}>
                Why Choose GymFlow?
              </Heading>
              <Box style={{ marginBottom: '32px' }}>
                <Flex gap="3" style={{ marginBottom: '16px' }}>
                  <Box style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--green-9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckIcon color="white" width="12" height="12" />
                  </Box>
                  <Box>
                    <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
                      Easy Setup
                    </Text>
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>
                      Get started in minutes with our intuitive setup wizard
                    </Text>
                  </Box>
                </Flex>

                <Flex gap="3" style={{ marginBottom: '16px' }}>
                  <Box style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--green-9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckIcon color="white" width="12" height="12" />
                  </Box>
                  <Box>
                    <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
                      24/7 Support
                    </Text>
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>
                      Round-the-clock customer support whenever you need help
                    </Text>
                  </Box>
                </Flex>

                <Flex gap="3" style={{ marginBottom: '16px' }}>
                  <Box style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--green-9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckIcon color="white" width="12" height="12" />
                  </Box>
                  <Box>
                    <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
                      Affordable Pricing
                    </Text>
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>
                      Transparent pricing that scales with your gym&apos;s growth
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Button size="3" asChild>
                <Link href="/dashboard">
                  Start Your Free Trial
                  <ArrowRightIcon />
                </Link>
              </Button>
            </Box>

            <Card style={{ padding: '40px', background: 'var(--gray-2)' }}>
              <Heading size="6" style={{ marginBottom: '20px', textAlign: 'center' }}>
                Trusted by 500+ Gyms
              </Heading>
              <Grid columns="3" gap="4" style={{ textAlign: 'center' }}>
                <Box>
                  <Heading size="6" style={{ color: 'var(--accent-9)' }}>2.5K+</Heading>
                  <Text size="2">Active Members</Text>
                </Box>
                <Box>
                  <Heading size="6" style={{ color: 'var(--accent-9)' }}>98%</Heading>
                  <Text size="2">Satisfaction Rate</Text>
                </Box>
                <Box>
                  <Heading size="6" style={{ color: 'var(--accent-9)' }}>24/7</Heading>
                  <Text size="2">Uptime</Text>
                </Box>
              </Grid>
            </Card>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container size="4" style={{ padding: '80px 0' }}>
        <Card style={{ 
          padding: '60px 40px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--accent-9) 0%, var(--accent-10) 100%)'
        }}>
          <Heading size="7" style={{ color: 'white', marginBottom: '16px' }}>
            Ready to Transform Your Gym?
          </Heading>
          <Text size="4" style={{ color: 'var(--accent-1)', marginBottom: '32px' }}>
            Join hundreds of gym owners who have streamlined their operations with GymFlow.
          </Text>
          <Flex gap="3" justify="center">
            <Button size="4" variant="surface" onClick={handleGetStarted}>
              Get Started Now
              <ArrowRightIcon />
            </Button>
            <Button size="4" variant="outline" style={{ color: 'white', borderColor: 'white' }}>
              Contact Sales
            </Button>
          </Flex>
        </Card>
      </Container>

      {/* Footer */}
      <Box style={{ borderTop: '1px solid var(--gray-6)', background: 'var(--gray-2)' }}>
        <Container size="4" style={{ padding: '40px 0' }}>
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '6px', 
                background: 'var(--accent-9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PersonIcon color="white" width="16" height="16" />
              </Box>
              <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
                GymFlow
              </Text>
            </Flex>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              © 2024 GymFlow. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
