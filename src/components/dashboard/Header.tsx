'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Box, Flex, Heading, Badge, IconButton, DropdownMenu, Avatar, Text } from '@radix-ui/themes';
import { ExitIcon, GearIcon, PersonIcon, BellIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function DashboardHeader() {
  const { data: session } = useSession();

  const user = session?.user || {
    name: "Guest User",
    email: "guest@gym.com", 
    isAdmin: false,
    avatar: "/default-avatar.png"
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === 'admin' || false;

  const unreadNotifications = 3;

  const handleLogout = () => {
    signOut({ callbackUrl: '/signin' });
  };

  return (
    <Box style={{ backgroundColor: 'var(--blue-10)', color: 'white', padding: '16px', borderBottom: '1px solid var(--gray-6)' }}>
      <Flex align="center" justify="between">
        {/* Logo/Brand */}
        <Flex align="center" gap="3">
          <IconButton variant="ghost" size="1" style={{ display: 'block' }} className="md:hidden">
            <HamburgerMenuIcon />
          </IconButton>
          <Heading size="5">Gym Management System</Heading>
        </Flex>

        {/* User Actions */}
        <Flex gap="3" align="center">
          {/* Notifications */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" size="2" style={{ position: 'relative' }}>
                <BellIcon />
                {unreadNotifications > 0 && (
                  <Badge 
                    size="1" 
                    color="red"
                    style={{ 
                      position: 'absolute', 
                      top: '-4px', 
                      right: '-4px',
                      minWidth: '16px',
                      height: '16px',
                      fontSize: '10px'
                    }}
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="2" style={{ minWidth: '280px' }}>
              <DropdownMenu.Label>
                <Text size="2" weight="medium">Notifications</Text>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">New member joined</Text>
                  <Text size="1" color="gray">Sarah Johnson has joined the gym</Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">Payment received</Text>
                  <Text size="1" color="gray">Monthly fee payment from Mike Chen</Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">Membership expiring</Text>
                  <Text size="1" color="gray">3 memberships expire this week</Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item asChild>
                <Link href="/dashboard/notifications" style={{ textDecoration: 'none' }}>
                  <Text size="2" align="center" style={{ width: '100%' }}>View all notifications</Text>
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Flex align="center" gap="2" style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-2)' }}>
                <Avatar size="2" fallback={(user.name || 'U').substring(0, 2)} />
                <Box display={{ initial: 'none', md: 'block' }}>
                  <Text size="2" weight="medium">{user.name || 'User'}</Text>
                  <Text size="1" color="gray" style={{ display: 'block', lineHeight: 1 }}>
                    {isAdmin ? 'Admin' : 'User'}
                  </Text>
                </Box>
              </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="2">
              <DropdownMenu.Label>
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">{user.name}</Text>
                  <Text size="1" color="gray">{user.email}</Text>
                </Flex>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item asChild>
                <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
                  <PersonIcon /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
                  <GearIcon /> Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item color="red" onClick={handleLogout}>
                <ExitIcon /> Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
    </Box>
  );
}
