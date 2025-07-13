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
  IconButton,
  Dialog
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  BellIcon
} from "@radix-ui/react-icons";

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paymentMethod?: string;
  notes?: string;
}

const mockFees: FeeRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    studentEmail: "john.doe@example.com",
    amount: 50,
    dueDate: "2024-01-31",
    paidDate: "2024-01-28",
    status: "paid",
    paymentMethod: "Credit Card",
    notes: "Monthly membership fee"
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@example.com",
    amount: 75,
    dueDate: "2024-01-31",
    status: "unpaid",
    notes: "Premium membership fee"
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Mike Johnson",
    studentEmail: "mike.johnson@example.com",
    amount: 50,
    dueDate: "2024-01-15",
    status: "overdue",
    notes: "Monthly membership fee - overdue"
  },
  {
    id: "4",
    studentId: "4",
    studentName: "Sarah Wilson",
    studentEmail: "sarah.wilson@example.com",
    amount: 100,
    dueDate: "2024-02-15",
    status: "unpaid",
    notes: "Personal training package"
  },
  {
    id: "5",
    studentId: "5",
    studentName: "David Brown",
    studentEmail: "david.brown@example.com",
    amount: 60,
    dueDate: "2024-01-31",
    paidDate: "2024-01-30",
    status: "paid",
    paymentMethod: "Bank Transfer",
    notes: "Premium membership fee"
  }
];

export default function FeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof FeeRecord>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [newFeeData, setNewFeeData] = useState({
    studentName: "",
    amount: "",
    dueDate: "",
    notes: ""
  });
  
  const feesPerPage = 10;

  const filteredAndSortedFees = useMemo(() => {
    const filtered = mockFees.filter(fee => {
      const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fee.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || fee.status === statusFilter;
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

  const totalPages = Math.ceil(filteredAndSortedFees.length / feesPerPage);
  const paginatedFees = filteredAndSortedFees.slice(
    (currentPage - 1) * feesPerPage,
    currentPage * feesPerPage
  );

  const handleSort = (column: keyof FeeRecord) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "green";
      case "unpaid": return "orange";
      case "overdue": return "red";
      default: return "gray";
    }
  };

  const handleAddFee = () => {
    // Mock API call
    console.log("Adding fee:", newFeeData);
    setShowAddFeeDialog(false);
    setNewFeeData({ studentName: "", amount: "", dueDate: "", notes: "" });
  };

  const handleSendReminder = (feeId: string) => {
    // Mock API call
    console.log("Sending reminder for fee:", feeId);
    alert("Reminder sent successfully!");
  };

  const stats = {
    totalIncome: mockFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
    unpaidAmount: mockFees.filter(f => f.status === 'unpaid' || f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0),
    overdueCount: mockFees.filter(f => f.status === 'overdue').length,
    paidCount: mockFees.filter(f => f.status === 'paid').length
  };

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Fees Management</Heading>
          <Button onClick={() => setShowAddFeeDialog(true)}>
            <PlusIcon /> Add Fee
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total Income</Text>
              <Text size="6" weight="bold" color="green">${stats.totalIncome}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Unpaid Amount</Text>
              <Text size="6" weight="bold" color="red">${stats.unpaidAmount}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Paid Fees</Text>
              <Text size="6" weight="bold" color="green">{stats.paidCount}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Overdue Fees</Text>
              <Text size="6" weight="bold" color="red">{stats.overdueCount}</Text>
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
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </Box>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="paid">Paid</Select.Item>
                <Select.Item value="unpaid">Unpaid</Select.Item>
                <Select.Item value="overdue">Overdue</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Fees Table */}
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("studentName")}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Student {sortBy === "studentName" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("amount")}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("dueDate")}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Due Date {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Paid Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Payment Method</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedFees.map((fee) => (
                <Table.Row key={fee.id}>
                  <Table.Cell>
                    <Box>
                      <Text weight="medium">{fee.studentName}</Text>
                      <Text size="1" color="gray">{fee.studentEmail}</Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">${fee.amount}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{new Date(fee.dueDate).toLocaleDateString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray">
                      {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : "-"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(fee.status)} variant="soft">
                      {fee.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray">{fee.paymentMethod || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <IconButton size="1" variant="ghost">
                        <EyeOpenIcon />
                      </IconButton>
                      {fee.status !== "paid" && (
                        <IconButton 
                          size="1" 
                          variant="ghost" 
                          color="orange"
                          onClick={() => handleSendReminder(fee.id)}
                        >
                          <BellIcon />
                        </IconButton>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <Flex justify="between" align="center" pt="4">
            <Text size="2" color="gray">
              Showing {((currentPage - 1) * feesPerPage) + 1} to {Math.min(currentPage * feesPerPage, filteredAndSortedFees.length)} of {filteredAndSortedFees.length} fees
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

        {/* Add Fee Dialog */}
        <Dialog.Root open={showAddFeeDialog} onOpenChange={setShowAddFeeDialog}>
          <Dialog.Content style={{ maxWidth: '500px' }}>
            <Dialog.Title>Add New Fee</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Add a fee record for a student.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Student Name
                </Text>
                <TextField.Root
                  placeholder="Enter student name"
                  value={newFeeData.studentName}
                  onChange={(e) => setNewFeeData(prev => ({ ...prev, studentName: e.target.value }))}
                />
              </Box>
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Amount ($)
                </Text>
                <TextField.Root
                  type="number"
                  placeholder="Enter amount"
                  value={newFeeData.amount}
                  onChange={(e) => setNewFeeData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </Box>
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Due Date
                </Text>
                <TextField.Root
                  type="date"
                  value={newFeeData.dueDate}
                  onChange={(e) => setNewFeeData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </Box>
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Notes
                </Text>
                <TextField.Root
                  placeholder="Enter notes (optional)"
                  value={newFeeData.notes}
                  onChange={(e) => setNewFeeData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Box>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleAddFee}>Add Fee</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
