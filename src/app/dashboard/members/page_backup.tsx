'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';  
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  Table, 
  Text, 
  Badge, 
  Link as RadixLink,
  TextField,
  Select,
  Grid,
  Card,
  Avatar
} from '@radix-ui/themes';
import { 
  PlusIcon, 
  Pencil1Icon, 
  TrashIcon, 
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import Loader from '@/components/ui/Loader';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  age?: number;
  gender?: string;
  goal?: string;
  level?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  trainerId?: string;
}

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

const MembersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const sessionUser = session?.user as SessionUser;
  const [users, setUsers] = useState<User[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }
      
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleAssignTrainer = async (trainerId: string, userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign trainer');
      }

      toast.success('Trainer assigned successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error assigning trainer:', error);
      toast.error('Failed to assign trainer');
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
      if (sessionUser?.role === 'admin') {
        fetchTrainers();
      }
    }
  }, [session?.user, sessionUser?.role]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.isActive) ||
                           (statusFilter === 'inactive' && !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage, usersPerPage]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      members: users.filter(u => u.role === 'user').length,
      trainers: users.filter(u => u.role === 'trainer').length,
      active: users.filter(u => u.isActive).length
    };
  }, [users]);

  // Authentication checks
  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    router.push('/signin');
    return null;
  }

  const isAdminOrTrainer = sessionUser?.role === "admin" || sessionUser?.role === "trainer";
  
  if (!isAdminOrTrainer) {
    return (
      <Box style={{ padding: '2rem', textAlign: 'center' }}>
        <Heading size="5">Unauthorized</Heading>
        <Text color="gray">You don&apos;t have permission to access this page.</Text>
      </Box>
    );
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Flex align="center" justify="between" mb="6">
        <Box>
          <Heading size="5">Manage Users</Heading>
          <Text color="gray" size="2">Manage members and trainers</Text>
        </Box>
        <Button asChild color="blue">
          <Link href="/dashboard/add-user">
            <PlusIcon /> Add Member
          </Link>
        </Button>
      </Flex>

      {/* Statistics Cards */}
      <Grid columns={{ initial: '2', sm: '4' }} gap="4" mb="6">
        <Card style={{ padding: "16px" }}>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Total Users</Text>
            <Text size="5" weight="bold">{stats.total}</Text>
          </Flex>
        </Card>
        <Card style={{ padding: "16px" }}>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Members</Text>
            <Text size="5" weight="bold" color="blue">{stats.members}</Text>
          </Flex>
        </Card>
        <Card style={{ padding: "16px" }}>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Trainers</Text>
            <Text size="5" weight="bold" color="green">{stats.trainers}</Text>
          </Flex>
        </Card>
        <Card style={{ padding: "16px" }}>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Active Users</Text>
            <Text size="5" weight="bold" color="orange">{stats.active}</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Filters and Search */}
      <Card style={{ padding: "16px", marginBottom: "16px" }}>
        <Grid columns={{ initial: '1', sm: '3' }} gap="3">
          <TextField.Root 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          
          <Select.Root value={roleFilter} onValueChange={setRoleFilter}>
            <Select.Trigger placeholder="Filter by role" />
            <Select.Content>
              <Select.Item value="all">All Roles</Select.Item>
              <Select.Item value="user">Members</Select.Item>
              <Select.Item value="trainer">Trainers</Select.Item>
              <Select.Item value="admin">Admins</Select.Item>
            </Select.Content>
          </Select.Root>
          
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger placeholder="Filter by status" />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="active">🟢 Active</Select.Item>
              <Select.Item value="inactive">🔴 Inactive</Select.Item>
            </Select.Content>
          </Select.Root>
        </Grid>
      </Card>

      {/* Users Table */}
      <Card style={{ padding: "16px" }}>
        <Box style={{ overflowX: 'auto' }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                {sessionUser?.role === 'admin' && (
                  <Table.ColumnHeaderCell>Assign Trainer</Table.ColumnHeaderCell>
                )}
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {currentUsers.map((user, index) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{(currentPage - 1) * usersPerPage + index + 1}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar
                        size="2"
                        src={user.image}
                        fallback={user.name?.charAt(0) || "U"}
                      />
                      <Box>
                        <RadixLink asChild color="blue">
                          <Link href={`/dashboard/user/${user._id}`}>
                            <Text weight="medium">{user.name}</Text>
                          </Link>
                        </RadixLink>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{user.email}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">
                      {user.isActive ? "🟢 Online" : "🔴 Offline"}
                    </Text>
                  </Table.Cell>
                  {sessionUser?.role === 'admin' && (
                    <Table.Cell>
                      {user.role === 'user' && (
                        <Select.Root
                          value={user.trainerId || ""}
                          onValueChange={(value) => handleAssignTrainer(value, user._id)}
                        >
                          <Select.Trigger placeholder="Select Trainer" style={{ width: "100%" }} />
                          <Select.Content>
                            <Select.Item value="" disabled>
                              Select a Trainer
                            </Select.Item>
                            {trainers.map((trainer) => (
                              <Select.Item key={trainer._id} value={trainer._id}>
                                {trainer.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <Badge 
                      color={
                        user.role === 'admin' ? 'red' : 
                        user.role === 'trainer' ? 'blue' : 'green'
                      }
                      variant="soft"
                    >
                      {user.role === 'user' ? 'Member' : 
                       user.role === 'trainer' ? 'Trainer' : 'Admin'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button variant="ghost" size="1" asChild>
                        <Link href={`/dashboard/user/${user._id}`}>
                          <Pencil1Icon />
                        </Link>
                      </Button>
                      {sessionUser?.role === 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="1" 
                          color="red"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <TrashIcon />
                        </Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center" gap="2" style={{ marginTop: "16px" }}>
            <Button
              variant="soft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Text size="2" style={{ padding: "8px 16px" }}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              variant="soft"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </Flex>
        )}
      </Card>

      {filteredUsers.length === 0 && (
        <Box style={{ textAlign: 'center', padding: '2rem' }}>
          <Text color="gray">No users found matching your criteria.</Text>
        </Box>
      )}
    </Box>
  );
};

export default MembersPage;
