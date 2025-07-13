import Link from 'next/link';
import { Box, Flex, Heading, Button, Table, Badge, Link as RadixLink } from '@radix-ui/themes';
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

export default function PackagesPage() {
  // In a real app, this would be fetched from an API
  const packages = [
    { 
      id: 1, 
      name: 'Basic Membership', 
      cycle: 'Monthly', 
      services: 3, 
      amount: 29.99, 
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Premium Membership', 
      cycle: 'Monthly', 
      services: 5, 
      amount: 49.99, 
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Annual Basic', 
      cycle: 'Yearly', 
      services: 3, 
      amount: 299.99, 
      status: 'active' 
    },
  ];

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Heading size="5">Packages</Heading>
        <Button asChild color="blue">
          <Link href="/dashboard/packages/new">
            <PlusIcon /> Add Package
          </Link>
        </Button>
      </Flex>

      <Box style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Billing Cycle</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Services</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {packages.map((pkg) => (
              <Table.Row key={pkg.id}>
                <Table.Cell>{pkg.id}</Table.Cell>
                <Table.Cell>
                  <RadixLink asChild color="blue">
                    <Link href={`/dashboard/packages/${pkg.id}`}>
                      {pkg.name}
                    </Link>
                  </RadixLink>
                </Table.Cell>
                <Table.Cell>{pkg.cycle}</Table.Cell>
                <Table.Cell>{pkg.services}</Table.Cell>
                <Table.Cell>${pkg.amount.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  <Badge 
                    color={pkg.status === 'active' ? 'green' : 'red'}
                    variant="soft"
                  >
                    {pkg.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <RadixLink asChild color="blue">
                      <Link href={`/dashboard/packages/${pkg.id}`}>
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
