"use client";

import { useState, useMemo } from "react";
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  Table, 
  Text, 
  Badge, 
  Card,
  TextField,
  Select,
  IconButton,
  Dialog
} from '@radix-ui/themes';
import { 
  PlusIcon, 
  Pencil1Icon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';

interface AttendanceRecord {
  id: number;
  memberName: string;
  memberEmail: string;
  checkInTime: string | null;
  checkOutTime?: string | null;
  status: 'present' | 'absent' | 'late';
  date: string;
  notes?: string;
}

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMarkAttendanceDialog, setShowMarkAttendanceDialog] = useState(false);
  
  const recordsPerPage = 10;

  // Enhanced mock data
  const attendanceRecords: AttendanceRecord[] = useMemo(() => [
    { 
      id: 1, 
      memberName: 'John Doe',
      memberEmail: 'john.doe@example.com',
      checkInTime: '2025-06-29T09:00:00Z',
      checkOutTime: '2025-06-29T18:30:00Z',
      status: 'present',
      date: '2025-06-29',
      notes: 'Regular workout session'
    },
    { 
      id: 2, 
      memberName: 'Jane Smith',
      memberEmail: 'jane.smith@example.com', 
      checkInTime: '2025-06-29T08:30:00Z',
      checkOutTime: '2025-06-29T17:45:00Z',
      status: 'present',
      date: '2025-06-29'
    },
    { 
      id: 3, 
      memberName: 'Mike Johnson',
      memberEmail: 'mike.johnson@example.com',
      checkInTime: null,
      status: 'absent',
      date: '2025-06-29'
    },
    { 
      id: 4, 
      memberName: 'Sarah Wilson',
      memberEmail: 'sarah.wilson@example.com',
      checkInTime: '2025-06-29T10:15:00Z',
      status: 'late',
      date: '2025-06-29',
      notes: 'Arrived 15 minutes late'
    },
    { 
      id: 5, 
      memberName: 'David Brown',
      memberEmail: 'david.brown@example.com',
      checkInTime: '2025-06-29T07:45:00Z',
      checkOutTime: '2025-06-29T19:00:00Z',
      status: 'present',
      date: '2025-06-29'
    },
    { 
      id: 6, 
      memberName: 'Lisa Chen',
      memberEmail: 'lisa.chen@example.com',
      checkInTime: '2025-06-28T09:30:00Z',
      checkOutTime: '2025-06-28T18:15:00Z',
      status: 'present',
      date: '2025-06-28'
    },
    { 
      id: 7, 
      memberName: 'Alex Rodriguez',
      memberEmail: 'alex.rodriguez@example.com',
      checkInTime: null,
      status: 'absent',
      date: '2025-06-28'
    }
  ], []);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const matchesSearch = record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesDate = !dateFilter || record.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendanceRecords, searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'green';
      case 'absent': return 'red';
      case 'late': return 'orange';
      default: return 'gray';
    }
  };

  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length
  };

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex align="center" justify="between">
          <Heading size="6">Attendance Management</Heading>
          <Button onClick={() => setShowMarkAttendanceDialog(true)}>
            <PlusIcon /> Mark Attendance
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <Card style={{ minWidth: '150px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total</Text>
              <Text size="6" weight="bold">{stats.total}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '150px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Present</Text>
              <Text size="6" weight="bold" color="green">{stats.present}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '150px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Absent</Text>
              <Text size="6" weight="bold" color="red">{stats.absent}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '150px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Late</Text>
              <Text size="6" weight="bold" color="orange">{stats.late}</Text>
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </Box>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="present">Present</Select.Item>
                <Select.Item value="absent">Absent</Select.Item>
                <Select.Item value="late">Late</Select.Item>
              </Select.Content>
            </Select.Root>
            <TextField.Root
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </Flex>
        </Card>

        {/* Attendance Table */}
        <Card>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Check-in Time</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Check-out Time</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {paginatedRecords.map((record) => (
                <Table.Row key={record.id}>
                  <Table.Cell>
                    <Box>
                      <Text weight="medium">{record.memberName}</Text>
                      <Text size="1" color="gray">{record.memberEmail}</Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>{new Date(record.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {record.checkInTime 
                      ? new Date(record.checkInTime).toLocaleTimeString() 
                      : '-'
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {record.checkOutTime 
                      ? new Date(record.checkOutTime).toLocaleTimeString() 
                      : '-'
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={getStatusColor(record.status)}
                      variant="soft"
                    >
                      {record.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" color="gray">{record.notes || '-'}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <IconButton size="1" variant="ghost">
                        <Pencil1Icon />
                      </IconButton>
                      <IconButton size="1" variant="ghost" color="red">
                        <TrashIcon />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <Flex justify="between" align="center" pt="4">
            <Text size="2" color="gray">
              Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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

        {/* Mark Attendance Dialog */}
        <Dialog.Root open={showMarkAttendanceDialog} onOpenChange={setShowMarkAttendanceDialog}>
          <Dialog.Content style={{ maxWidth: '500px' }}>
            <Dialog.Title>Mark Attendance</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Mark attendance for a member.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Member
                </Text>
                <Select.Root>
                  <Select.Trigger placeholder="Select member" />
                  <Select.Content>
                    <Select.Item value="1">John Doe</Select.Item>
                    <Select.Item value="2">Jane Smith</Select.Item>
                    <Select.Item value="3">Mike Johnson</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Date
                </Text>
                <TextField.Root type="date" />
              </Box>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Check-in Time
                </Text>
                <TextField.Root type="time" />
              </Box>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Status
                </Text>
                <Select.Root>
                  <Select.Trigger placeholder="Select status" />
                  <Select.Content>
                    <Select.Item value="present">Present</Select.Item>
                    <Select.Item value="late">Late</Select.Item>
                    <Select.Item value="absent">Absent</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button>Mark Attendance</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
