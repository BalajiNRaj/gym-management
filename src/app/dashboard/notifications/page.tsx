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
  Dialog,
  TextArea
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckIcon,
  EnvelopeClosedIcon,
  EnvelopeOpenIcon
} from "@radix-ui/react-icons";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  recipientType: 'all' | 'students' | 'trainers' | 'specific';
  recipients?: string[];
  sender: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to the Gym",
    message: "Welcome to our gym! We're excited to have you as part of our fitness community.",
    type: "success",
    priority: "medium",
    recipientType: "students",
    sender: "Admin",
    isRead: true,
    createdAt: "2024-01-20T09:00:00Z",
    readAt: "2024-01-20T10:30:00Z"
  },
  {
    id: "2",
    title: "Membership Fee Due",
    message: "Your monthly membership fee is due on January 31st. Please make sure to pay on time to avoid any disruption.",
    type: "warning",
    priority: "high",
    recipientType: "specific",
    recipients: ["john.doe@example.com", "jane.smith@example.com"],
    sender: "Finance Team",
    isRead: false,
    createdAt: "2024-01-25T14:00:00Z"
  },
  {
    id: "3",
    title: "New Exercise Added",
    message: "A new exercise 'HIIT Cardio Blast' has been added to your workout plan. Check it out in your exercise section.",
    type: "info",
    priority: "low",
    recipientType: "students",
    sender: "Alex Rodriguez",
    isRead: false,
    createdAt: "2024-01-26T11:00:00Z"
  },
  {
    id: "4",
    title: "Diet Plan Updated",
    message: "Your diet plan has been updated with new meal options. Please review the changes in your diet section.",
    type: "info",
    priority: "medium",
    recipientType: "specific",
    recipients: ["mike.johnson@example.com"],
    sender: "Lisa Chen",
    isRead: true,
    createdAt: "2024-01-27T16:30:00Z",
    readAt: "2024-01-27T17:00:00Z"
  },
  {
    id: "5",
    title: "Gym Maintenance Notice",
    message: "The gym will undergo maintenance on February 1st from 6 AM to 8 AM. Please plan your workouts accordingly.",
    type: "warning",
    priority: "high",
    recipientType: "all",
    sender: "Management",
    isRead: false,
    createdAt: "2024-01-28T12:00:00Z"
  }
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "medium",
    recipientType: "all",
    recipients: ""
  });
  
  const notificationsPerPage = 10;

  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || notification.type === typeFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "read" && notification.isRead) ||
                           (statusFilter === "unread" && !notification.isRead);
      const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [searchTerm, typeFilter, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "green";
      case "warning": return "orange";
      case "error": return "red";
      case "info": return "blue";
      default: return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "orange";
      case "low": return "green";
      default: return "gray";
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Mock API call
    console.log("Marking as read:", notificationId);
  };

  const handleCreateNotification = () => {
    // Mock API call
    console.log("Creating notification:", newNotification);
    setShowCreateDialog(false);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      recipientType: "all",
      recipients: ""
    });
  };

  const stats = {
    total: mockNotifications.length,
    unread: mockNotifications.filter(n => !n.isRead).length,
    highPriority: mockNotifications.filter(n => n.priority === 'high').length,
    sent: mockNotifications.length
  };

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Notifications</Heading>
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon /> Send Notification
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total Notifications</Text>
              <Text size="6" weight="bold">{stats.total}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Unread</Text>
              <Text size="6" weight="bold" color="orange">{stats.unread}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">High Priority</Text>
              <Text size="6" weight="bold" color="red">{stats.highPriority}</Text>
            </Flex>
          </Card>
          <Card style={{ minWidth: '200px' }}>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Sent</Text>
              <Text size="6" weight="bold" color="green">{stats.sent}</Text>
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
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </Box>
            <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
              <Select.Trigger placeholder="Filter by type" />
              <Select.Content>
                <Select.Item value="all">All Types</Select.Item>
                <Select.Item value="info">Info</Select.Item>
                <Select.Item value="warning">Warning</Select.Item>
                <Select.Item value="success">Success</Select.Item>
                <Select.Item value="error">Error</Select.Item>
              </Select.Content>
            </Select.Root>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="read">Read</Select.Item>
                <Select.Item value="unread">Unread</Select.Item>
              </Select.Content>
            </Select.Root>
            <Select.Root value={priorityFilter} onValueChange={setPriorityFilter}>
              <Select.Trigger placeholder="Filter by priority" />
              <Select.Content>
                <Select.Item value="all">All Priorities</Select.Item>
                <Select.Item value="high">High</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="low">Low</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Notifications Table */}
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Recipients</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Sender</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedNotifications.map((notification) => (
                <Table.Row key={notification.id} style={{ opacity: notification.isRead ? 0.7 : 1 }}>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {notification.isRead ? (
                        <EnvelopeOpenIcon color="gray" />
                      ) : (
                        <EnvelopeClosedIcon color="blue" />
                      )}
                      <Text size="1" color={notification.isRead ? "gray" : "blue"}>
                        {notification.isRead ? "Read" : "Unread"}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Box>
                      <Text weight="medium" size="2">{notification.title}</Text>
                      <Text size="1" color="gray" style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {notification.message}
                      </Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getTypeColor(notification.type)} variant="soft">
                      {notification.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getPriorityColor(notification.priority)} variant="soft">
                      {notification.priority}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" color="gray">
                      {notification.recipientType === 'all' ? 'All Users' : 
                       notification.recipientType === 'students' ? 'All Students' :
                       notification.recipientType === 'trainers' ? 'All Trainers' :
                       `${notification.recipients?.length || 0} Users`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{notification.sender}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" color="gray">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <IconButton size="1" variant="ghost">
                        <EyeOpenIcon />
                      </IconButton>
                      {!notification.isRead && (
                        <IconButton 
                          size="1" 
                          variant="ghost" 
                          color="green"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckIcon />
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
              Showing {((currentPage - 1) * notificationsPerPage) + 1} to {Math.min(currentPage * notificationsPerPage, filteredNotifications.length)} of {filteredNotifications.length} notifications
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

        {/* Create Notification Dialog */}
        <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>Send New Notification</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Send a notification to users in the system.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Title
                </Text>
                <TextField.Root
                  placeholder="Enter notification title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                />
              </Box>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Message
                </Text>
                <TextArea
                  placeholder="Enter notification message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </Box>
              
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Type
                  </Text>
                  <Select.Root 
                    value={newNotification.type} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
                  >
                    <Select.Trigger placeholder="Select type" />
                    <Select.Content>
                      <Select.Item value="info">Info</Select.Item>
                      <Select.Item value="warning">Warning</Select.Item>
                      <Select.Item value="success">Success</Select.Item>
                      <Select.Item value="error">Error</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Priority
                  </Text>
                  <Select.Root 
                    value={newNotification.priority} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value }))}
                  >
                    <Select.Trigger placeholder="Select priority" />
                    <Select.Content>
                      <Select.Item value="low">Low</Select.Item>
                      <Select.Item value="medium">Medium</Select.Item>
                      <Select.Item value="high">High</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Recipients
                </Text>
                <Select.Root 
                  value={newNotification.recipientType} 
                  onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipientType: value }))}
                >
                  <Select.Trigger placeholder="Select recipients" />
                  <Select.Content>
                    <Select.Item value="all">All Users</Select.Item>
                    <Select.Item value="students">All Students</Select.Item>
                    <Select.Item value="trainers">All Trainers</Select.Item>
                    <Select.Item value="specific">Specific Users</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              {newNotification.recipientType === 'specific' && (
                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Email Addresses (comma separated)
                  </Text>
                  <TextField.Root
                    placeholder="user1@example.com, user2@example.com"
                    value={newNotification.recipients}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                  />
                </Box>
              )}
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleCreateNotification}>
                Send Notification
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
