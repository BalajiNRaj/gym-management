import { ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/Header';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { Flex, Box } from '@radix-ui/themes';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      <DashboardHeader />
      <Flex style={{ flex: 1 }}>
        <DashboardSidebar />
        <Box style={{ flex: 1, padding: '24px' }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
