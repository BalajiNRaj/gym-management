"use client";

import { useState, useMemo } from "react";
import { 
  Box, 
  Flex, 
  Heading, 
  Table, 
  Badge, 
  Button,
  TextField,
  Select,
  Card,
  Text,
  IconButton
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@radix-ui/react-icons";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: 'active' | 'inactive' | 'expired';
  joinDate: string;
  lastActivity: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    membershipStatus: "active",
    joinDate: "2024-01-15",
    lastActivity: "2024-01-20"
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    membershipStatus: "active",
    joinDate: "2024-01-10",
    lastActivity: "2024-01-19"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com", 
    phone: "(555) 345-6789",
    membershipStatus: "expired",
    joinDate: "2023-12-01",
    lastActivity: "2024-01-05"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "(555) 456-7890", 
    membershipStatus: "inactive",
    joinDate: "2024-01-05",
    lastActivity: "2024-01-18"
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "(555) 567-8901",
    membershipStatus: "active",
    joinDate: "2023-11-20",
    lastActivity: "2024-01-20"
  }
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Student>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const studentsPerPage = 10;

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = mockStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || student.membershipStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / studentsPerPage);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleSort = (column: keyof Student) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "green";
      case "inactive": return "orange"; 
      case "expired": return "red";
      default: return "gray";
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Students Management</Heading>
          <Button asChild>
            <Link href="/dashboard/add-user">Add New Student</Link>
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total Students</Text>
              <Text size="6" weight="bold">{mockStudents.length}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Active Members</Text>
              <Text size="6" weight="bold" color="green">
                {mockStudents.filter(s => s.membershipStatus === 'active').length}
              </Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Expired Members</Text>
              <Text size="6" weight="bold" color="red">
                {mockStudents.filter(s => s.membershipStatus === 'expired').length}
              </Text>
            </Flex>
          </Card>
        </Flex>

        {/* Filters */}
        <Card>
          <Flex gap="4" align="center" wrap="wrap">
            <Box style={{ position: 'relative', flexGrow: 1, maxWidth: '300px' }}>
              <MagnifyingGlassIcon 
                style={{ 
                  position: 'absolute', 
                  left: '8px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-9)'
                }} 
              />
              <TextField.Root
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </Box>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="inactive">Inactive</Select.Item>
                <Select.Item value="expired">Expired</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Students Table */}
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("name")}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("email")}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Join Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedStudents.map((student) => (
                <Table.Row key={student.id}>
                  <Table.Cell>
                    <Text weight="medium">{student.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray">{student.email}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{student.phone}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(student.membershipStatus)} variant="soft">
                      {student.membershipStatus}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{new Date(student.joinDate).toLocaleDateString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton size="1" variant="ghost" asChild>
                      <Link href={`/dashboard/students/${student.id}`}>
                        <EyeOpenIcon />
                      </Link>
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <Flex justify="between" align="center" pt="4">
            <Text size="2" color="gray">
              Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, filteredAndSortedStudents.length)} of {filteredAndSortedStudents.length} students
            </Text>
            <Flex gap="2" align="center">
              <IconButton 
                variant="soft" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Text size="2">
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton 
                variant="soft" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRightIcon />
              </IconButton>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
