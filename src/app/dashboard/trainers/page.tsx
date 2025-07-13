"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { 
  Box, 
  Flex, 
  Heading, 
  Table, 
  Badge, 
  Button,
  TextField,
  Card,
  Text,
  Avatar,
  Link as RadixLink
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from "@radix-ui/react-icons";
import Link from "next/link";
import Loader from "@/components/ui/Loader";

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  age?: number;
  gender?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const TrainersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const sessionUser = session?.user as SessionUser;
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [trainersPerPage] = useState(10);

  useEffect(() => {
    if (session?.user) {
      fetchTrainers();
    }
  }, [session?.user]);

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trainers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }
      
      const data = await response.json();
      setTrainers(data.data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to load trainers');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter trainers based on search
  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => 
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trainers, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const currentTrainers = filteredTrainers.slice(
    (currentPage - 1) * trainersPerPage,
    currentPage * trainersPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex align="center" justify="between">
          <Box>
            <Heading size="5">Trainers</Heading>
            <Text color="gray" size="2">View and manage gym trainers</Text>
          </Box>
          <Button asChild color="blue">
            <Link href="/dashboard/add-user">
              <PlusIcon /> Add Trainer
            </Link>
          </Button>
        </Flex>

        {/* Statistics */}
        <Card style={{ padding: "16px" }}>
          <Flex gap="6">
            <Box>
              <Text size="1" color="gray">Total Trainers</Text>
              <Text size="5" weight="bold">{trainers.length}</Text>
            </Box>
            <Box>
              <Text size="1" color="gray">Active Trainers</Text>
              <Text size="5" weight="bold" color="green">
                {trainers.filter(t => t.isActive).length}
              </Text>
            </Box>
            <Box>
              <Text size="1" color="gray">Inactive Trainers</Text>
              <Text size="5" weight="bold" color="red">
                {trainers.filter(t => !t.isActive).length}
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* Search */}
        <Card style={{ padding: "16px" }}>
          <TextField.Root 
            placeholder="Search trainers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </Card>

        {/* Trainers Table */}
        <Card style={{ padding: "16px" }}>
          <Box style={{ overflowX: 'auto' }}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Trainer</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Join Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>
                {currentTrainers.map((trainer, index) => (
                  <Table.Row key={trainer._id}>
                    <Table.Cell>{(currentPage - 1) * trainersPerPage + index + 1}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="3">
                        <Avatar
                          size="2"
                          src={trainer.image}
                          fallback={trainer.name?.charAt(0) || "T"}
                        />
                        <Box>
                          <RadixLink asChild color="blue">
                            <Link href={`/dashboard/user/${trainer._id}`}>
                              <Text weight="medium">{trainer.name}</Text>
                            </Link>
                          </RadixLink>
                          {trainer.age && (
                            <Text size="1" color="gray" style={{ display: 'block' }}>
                              {trainer.age} years old
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{trainer.email}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={trainer.isActive ? 'green' : 'red'}
                        variant="soft"
                      >
                        {trainer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {trainer.createdAt ? formatDate(trainer.createdAt) : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Button variant="ghost" size="1" asChild>
                        <Link href={`/dashboard/user/${trainer._id}`}>
                          <EyeOpenIcon />
                        </Link>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="between" align="center" style={{ marginTop: "16px" }}>
              <Text size="2" color="gray">
                Showing {(currentPage - 1) * trainersPerPage + 1} to {Math.min(currentPage * trainersPerPage, filteredTrainers.length)} of {filteredTrainers.length} trainers
              </Text>
              <Flex gap="2">
                <Button
                  variant="soft"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeftIcon />
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
                  <ChevronRightIcon />
                </Button>
              </Flex>
            </Flex>
          )}
        </Card>

        {filteredTrainers.length === 0 && !isLoading && (
          <Box style={{ textAlign: 'center', padding: '2rem' }}>
            <Text color="gray">No trainers found matching your search criteria.</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default TrainersPage;
