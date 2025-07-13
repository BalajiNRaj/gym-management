import Link from 'next/link';
import { Box, Flex, Heading, Button, Table, Text, Badge, Link as RadixLink } from '@radix-ui/themes';
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

export default function CyclesPage() {
  // In a real app, this would be fetched from an API
  const cycles = [
    { 
      id: 1, 
      name: 'Monthly',
      duration: 30,
      unit: 'days',
      description: 'Standard monthly billing cycle',
      packagesCount: 8,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Quarterly',
      duration: 3,
      unit: 'months',
      description: '3-month billing cycle with discount',
      packagesCount: 3,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Annual',
      duration: 12,
      unit: 'months',
      description: 'Annual billing cycle with maximum discount',
      packagesCount: 2,
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Weekly',
      duration: 7,
      unit: 'days',
      description: 'Short-term weekly billing',
      packagesCount: 1,
      status: 'inactive'
    },
  ];

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Heading size="5">Billing Cycles</Heading>
        <Button asChild color="blue">
          <Link href="/dashboard/cycles/new">
            <PlusIcon /> Add Cycle
          </Link>
        </Button>
      </Flex>

      <Box style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Packages</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {cycles.map((cycle) => (
              <Table.Row key={cycle.id}>
                <Table.Cell>{cycle.id}</Table.Cell>
                <Table.Cell>
                  <Text weight="medium">{cycle.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{cycle.duration} {cycle.unit}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" color="gray">{cycle.description}</Text>
                </Table.Cell>
                <Table.Cell>{cycle.packagesCount}</Table.Cell>
                <Table.Cell>
                  <Badge 
                    color={cycle.status === 'active' ? 'green' : 'red'}
                    variant="soft"
                  >
                    {cycle.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <RadixLink asChild color="blue">
                      <Link href={`/dashboard/cycles/${cycle.id}`}>
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
