import Link from 'next/link';
import { Box, Flex, Heading, Button, Table, Text, Badge, Link as RadixLink } from '@radix-ui/themes';
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

export default function SubscriptionsPage() {
  // In a real app, this would be fetched from an API
  const subscriptions = [
    { 
      id: 1, 
      memberName: 'John Doe',
      packageName: 'Premium Membership',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'active',
      amount: 599.99
    },
    { 
      id: 2, 
      memberName: 'Jane Smith',
      packageName: 'Basic Membership',
      startDate: '2025-06-01',
      endDate: '2025-12-01',
      status: 'active',
      amount: 299.99
    },
    { 
      id: 3, 
      memberName: 'Mike Johnson',
      packageName: 'Premium Membership',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'expired',
      amount: 599.99
    },
  ];

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Heading size="5">Subscriptions</Heading>
        <Button asChild color="blue">
          <Link href="/dashboard/subscriptions/new">
            <PlusIcon /> Add Subscription
          </Link>
        </Button>
      </Flex>

      <Box style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Package</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>End Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {subscriptions.map((subscription) => (
              <Table.Row key={subscription.id}>
                <Table.Cell>{subscription.id}</Table.Cell>
                <Table.Cell>
                  <Text weight="medium">{subscription.memberName}</Text>
                </Table.Cell>
                <Table.Cell>{subscription.packageName}</Table.Cell>
                <Table.Cell>{subscription.startDate}</Table.Cell>
                <Table.Cell>{subscription.endDate}</Table.Cell>
                <Table.Cell>${subscription.amount.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  <Badge 
                    color={subscription.status === 'active' ? 'green' : subscription.status === 'expired' ? 'red' : 'yellow'}
                    variant="soft"
                  >
                    {subscription.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <RadixLink asChild color="blue">
                      <Link href={`/dashboard/subscriptions/${subscription.id}`}>
                        <Pencil1Icon /> Edit
                      </Link>
                    </RadixLink>
                    <RadixLink color="red">
                      <TrashIcon /> Delete
                    </RadixLink>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
