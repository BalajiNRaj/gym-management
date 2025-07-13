import Link from 'next/link';
import { Box, Flex, ScrollArea, Link as RadixLink, Text, Separator } from '@radix-ui/themes';
import {
  PersonIcon,
  ArchiveIcon,
  CubeIcon,
  ListBulletIcon,
  TimerIcon,
  StackIcon,
  CalendarIcon,
  PlusIcon,
  BackpackIcon,
  ActivityLogIcon,
  BellIcon,
  DashboardIcon,
  ReaderIcon
} from '@radix-ui/react-icons';

export default function DashboardSidebar() {
  const mainNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  ];

  const userManagementItems = [
    { label: 'Add User', href: '/dashboard/add-user', icon: <PlusIcon /> },
    { label: 'Members', href: '/dashboard/members', icon: <PersonIcon /> },
    { label: 'Students', href: '/dashboard/students', icon: <PersonIcon /> },
    { label: 'Trainers', href: '/dashboard/trainers', icon: <BackpackIcon /> },
  ];

  const businessManagementItems = [
    { label: 'Branches', href: '/dashboard/branches', icon: <StackIcon /> },
    { label: 'Packages', href: '/dashboard/packages', icon: <CubeIcon /> },
    { label: 'Subscriptions', href: '/dashboard/subscriptions', icon: <ListBulletIcon /> },
    { label: 'Cycles', href: '/dashboard/cycles', icon: <TimerIcon /> },
  ];

  const operationsNavItems = [
    { label: 'Attendance', href: '/dashboard/attendance', icon: <CalendarIcon /> },
    { label: 'Fees', href: '/dashboard/fees', icon: <ArchiveIcon /> },
    { label: 'Exercise', href: '/dashboard/exercise', icon: <ActivityLogIcon /> },
    { label: 'Diet', href: '/dashboard/diet', icon: <ReaderIcon /> },
    { label: 'Activities', href: '/dashboard/activities', icon: <ActivityLogIcon /> },
  ];

  const quickActionsItems = [
    { label: 'Notifications', href: '/dashboard/notifications', icon: <BellIcon /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <PersonIcon /> },
  ];

  // Student-specific navigation items (for user role)
  const studentNavItems = [
    { label: 'My Attendance', href: '/dashboard/attendance', icon: <CalendarIcon /> },
    { label: 'My Fees', href: '/dashboard/fees', icon: <ArchiveIcon /> },
    { label: 'My Exercise', href: '/dashboard/exercise', icon: <ActivityLogIcon /> },
    { label: 'My Diet Sheet', href: '/dashboard/diet', icon: <ReaderIcon /> },
  ];

  return (
    <Box 
      style={{ 
        width: '256px', 
        backgroundColor: 'var(--gray-2)',
        borderRight: '1px solid var(--gray-6)'
      }} 
      display={{ initial: 'none', md: 'block' }}
    >
      <ScrollArea style={{ height: 'calc(100vh - 64px)' }}>
        <Flex direction="column" p="4" gap="1">
          {/* Main Navigation */}
          <NavSection items={mainNavItems} />
          
          <Separator size="4" my="3" />
          
          {/* User Management Section */}
          <Box mb="3">
            <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              User Management
            </Text>
          </Box>
          <NavSection items={userManagementItems} />
          
          <Separator size="4" my="3" />
          
          {/* Business Management Section */}
          <Box mb="3">
            <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Business Management
            </Text>
          </Box>
          <NavSection items={businessManagementItems} />
          
          <Separator size="4" my="3" />
          
          {/* Operations Section */}
          <Box mb="3">
            <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operations
            </Text>
          </Box>
          <NavSection items={operationsNavItems} />
          
          <Separator size="4" my="3" />
          
          {/* Quick Actions */}
          <Box mb="3">
            <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Actions
            </Text>
          </Box>
          <NavSection items={quickActionsItems} />

          <Separator size="4" my="3" />
          
          {/* Student Features (hidden by default, would be shown based on user role) */}
          <Box mb="3" style={{ display: 'none' }}>
            <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Features
            </Text>
          </Box>
          <Box style={{ display: 'none' }}>
            <NavSection items={studentNavItems} />
          </Box>
        </Flex>
      </ScrollArea>
    </Box>
  );
}

function NavSection({ items }: { items: Array<{ label: string; href: string; icon: React.ReactNode }> }) {
  return (
    <>
      {items.map((item) => (
        <RadixLink
          key={item.href}
          asChild
          size="2"
          style={{ 
            padding: '8px 12px', 
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--gray-12)'
          }}
        >
          <Link href={item.href}>
            {item.icon}
            {item.label}
          </Link>
        </RadixLink>
      ))}
    </>
  );
}
