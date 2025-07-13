import { Box, Grid, Heading, Text, Card, Flex, Select, Badge, Table } from '@radix-ui/themes';
import { 
  PersonIcon, 
  ArchiveIcon, 
  CubeIcon, 
  StackIcon,
  DotFilledIcon
} from '@radix-ui/react-icons';

export default function Dashboard() {
  // Statistics would be fetched from API in a real application
  const statistics = {
    totalMembers: 145,
    activeMembers: 132,
    totalTrainers: 8,
    totalPackages: 12,
    totalSubscriptions: 98,
    activeBranches: 3,
    monthlyRevenue: 15420,
    unpaidFees: 2350,
    todayAttendance: 67
  };

  // Recent activities
  const recentActivities = [
    { id: 1, member: 'John Doe', action: 'Checked in', time: '2 minutes ago', type: 'attendance' },
    { id: 2, member: 'Jane Smith', action: 'Subscription renewed', time: '15 minutes ago', type: 'subscription' },
    { id: 3, member: 'Mike Johnson', action: 'Payment completed', time: '1 hour ago', type: 'payment' },
    { id: 4, member: 'Sarah Wilson', action: 'New member registration', time: '2 hours ago', type: 'registration' },
  ];

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Box>
          <Heading size="5">Dashboard</Heading>
          <Text color="gray" size="2">Welcome back! Here&apos;s what&apos;s happening at your gym today.</Text>
        </Box>
        <Select.Root defaultValue="online">
          <Select.Trigger>
            <DotFilledIcon color="green" /> Online
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="online">
              <DotFilledIcon color="green" /> Online
            </Select.Item>
            <Select.Item value="offline">
              <DotFilledIcon color="red" /> Offline
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      
      {/* Main Statistics */}
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4" mb="6">
        <DashboardCard 
          title="Total Members" 
          value={statistics.totalMembers}
          subtitle={`${statistics.activeMembers} active`}
          icon={<PersonIcon />}
          color="blue"
        />
        <DashboardCard 
          title="Monthly Revenue" 
          value={`$${statistics.monthlyRevenue.toLocaleString()}`}
          subtitle={`$${statistics.unpaidFees} unpaid`}
          icon={<ArchiveIcon />}
          color="green"
        />
        <DashboardCard 
          title="Active Subscriptions" 
          value={statistics.totalSubscriptions}
          subtitle={`${statistics.totalPackages} packages`}
          icon={<CubeIcon />}
          color="orange"
        />
        <DashboardCard 
          title="Today's Attendance" 
          value={statistics.todayAttendance}
          subtitle={`${Math.round((statistics.todayAttendance / statistics.activeMembers) * 100)}% of active members`}
          icon={<StackIcon />}
          color="purple"
        />
      </Grid>

      {/* Secondary Statistics */}
      <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="8">
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">Total Trainers</Text>
            <Text size="6" weight="bold">{statistics.totalTrainers}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">Active Branches</Text>
            <Text size="6" weight="bold">{statistics.activeBranches}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">Total Packages</Text>
            <Text size="6" weight="bold">{statistics.totalPackages}</Text>
          </Flex>
        </Card>
      </Grid>
      
      {/* Recent Activities */}
      <Box>
        <Heading size="4" mb="4">Recent Activities</Heading>
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Activity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recentActivities.map((activity) => (
                <Table.Row key={activity.id}>
                  <Table.Cell>
                    <Text weight="medium">{activity.member}</Text>
                  </Table.Cell>
                  <Table.Cell>{activity.action}</Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={
                        activity.type === 'attendance' ? 'blue' :
                        activity.type === 'subscription' ? 'green' :
                        activity.type === 'payment' ? 'orange' : 'purple'
                      }
                      variant="soft"
                    >
                      {activity.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">{activity.time}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </Box>
    </Box>
  );
}

function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}) {
  return (
    <Card size="3">
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between">
          <Text size="2" color="gray">{title}</Text>
          {icon && <Box style={{ color: `var(--${color}-9)` }}>{icon}</Box>}
        </Flex>
        <Text size="7" weight="bold">{value}</Text>
        {subtitle && <Text size="1" color="gray">{subtitle}</Text>}
      </Flex>
    </Card>
  );
}
