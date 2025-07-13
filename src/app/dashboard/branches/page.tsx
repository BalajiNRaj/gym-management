import Link from 'next/link';
import { Box, Flex, Heading, Button, Table, Text, Badge, Link as RadixLink } from '@radix-ui/themes';
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

export default function BranchesPage() {
  // In a real app, this would be fetched from an API
  const branches = [
    { 
      id: 1, 
      name: 'Downtown Branch',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      manager: 'John Manager',
      members: 145,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Westside Branch',
      address: '456 West Ave, Westside',
      phone: '+1 (555) 234-5678',
      manager: 'Jane Manager',
      members: 98,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Northside Branch',
      address: '789 North Blvd, Northside',
      phone: '+1 (555) 345-6789',
      manager: 'Mike Manager',
      members: 67,
      status: 'inactive'
    },
  ];

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Heading size="5">Branches</Heading>
        <Button asChild color="blue">
          <Link href="/dashboard/branches/new">
            <PlusIcon /> Add Branch
          </Link>
        </Button>
      </Flex>

      <Box style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Manager</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Members</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {branches.map((branch) => (
              <Table.Row key={branch.id}>
                <Table.Cell>{branch.id}</Table.Cell>
                <Table.Cell>
                  <Text weight="medium">{branch.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" color="gray">{branch.address}</Text>
                </Table.Cell>
                <Table.Cell>{branch.phone}</Table.Cell>
                <Table.Cell>{branch.manager}</Table.Cell>
                <Table.Cell>{branch.members}</Table.Cell>
                <Table.Cell>
                  <Badge 
                    color={branch.status === 'active' ? 'green' : 'red'}
                    variant="soft"
                  >
                    {branch.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <RadixLink asChild color="blue">
                      <Link href={`/dashboard/branches/${branch.id}`}>
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
