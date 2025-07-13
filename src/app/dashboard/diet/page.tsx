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
  Tabs,
  Checkbox
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon
} from "@radix-ui/react-icons";

interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  createdAt: string;
}

interface DietAssignment {
  id: string;
  studentId: string;
  studentName: string;
  foods: {
    foodId: string;
    foodName: string;
    breakfast: boolean;
    morningSnack: boolean;
    lunch: boolean;
    eveningSnack: boolean;
    dinner: boolean;
    quantity?: string;
    notes?: string;
  }[];
  fromDate: string;
  toDate: string;
  assignedBy: string;
  createdAt: string;
}

const mockFoods: Food[] = [
  {
    id: "1",
    name: "Grilled Chicken Breast",
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    servingSize: "100g",
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Brown Rice",
    category: "Carbohydrates",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    servingSize: "100g",
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "Broccoli",
    category: "Vegetables",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    servingSize: "100g",
    createdAt: "2024-01-01"
  },
  {
    id: "4",
    name: "Greek Yogurt",
    category: "Dairy",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    servingSize: "100g",
    createdAt: "2024-01-01"
  },
  {
    id: "5",
    name: "Almonds",
    category: "Nuts",
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    servingSize: "100g",
    createdAt: "2024-01-01"
  }
];

const mockDietAssignments: DietAssignment[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    foods: [
      {
        foodId: "1",
        foodName: "Grilled Chicken Breast",
        breakfast: false,
        morningSnack: false,
        lunch: true,
        eveningSnack: false,
        dinner: true,
        quantity: "150g"
      },
      {
        foodId: "2",
        foodName: "Brown Rice",
        breakfast: false,
        morningSnack: false,
        lunch: true,
        eveningSnack: false,
        dinner: true,
        quantity: "80g"
      },
      {
        foodId: "4",
        foodName: "Greek Yogurt",
        breakfast: true,
        morningSnack: true,
        lunch: false,
        eveningSnack: false,
        dinner: false,
        quantity: "200g"
      }
    ],
    fromDate: "2024-01-20",
    toDate: "2024-02-20",
    assignedBy: "Lisa Chen",
    createdAt: "2024-01-20"
  }
];

export default function DietPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage] = useState(1);
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  const foodsPerPage = 10;

  const filteredFoods = useMemo(() => {
    return mockFoods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * foodsPerPage,
    currentPage * foodsPerPage
  );

  const categories = Array.from(new Set(mockFoods.map(f => f.category)));

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Diet Management</Heading>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="manage">Manage Foods</Tabs.Trigger>
            <Tabs.Trigger value="assign">Assign Diet</Tabs.Trigger>
          </Tabs.List>

          {/* Manage Foods Tab */}
          <Tabs.Content value="manage">
            <Flex direction="column" gap="4">
              {/* Stats Cards */}
              <Flex gap="4" wrap="wrap">
                <Card style={{ minWidth: '200px' }}>
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Total Foods</Text>
                    <Text size="6" weight="bold">{mockFoods.length}</Text>
                  </Flex>
                </Card>
                <Card style={{ minWidth: '200px' }}>
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Categories</Text>
                    <Text size="6" weight="bold" color="blue">{categories.length}</Text>
                  </Flex>
                </Card>
                <Card style={{ minWidth: '200px' }}>
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Active Diets</Text>
                    <Text size="6" weight="bold" color="green">{mockDietAssignments.length}</Text>
                  </Flex>
                </Card>
              </Flex>

              {/* Controls */}
              <Flex justify="between" align="center">
                <Flex gap="4" align="center" wrap="wrap">
                  <Box style={{ position: 'relative', minWidth: '300px' }}>
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
                      placeholder="Search foods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '32px' }}
                    />
                  </Box>
                  <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
                    <Select.Trigger placeholder="Filter by category" />
                    <Select.Content>
                      <Select.Item value="all">All Categories</Select.Item>
                      {categories.map(category => (
                        <Select.Item key={category} value={category}>{category}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <Button onClick={() => setShowAddFoodDialog(true)}>
                  <PlusIcon /> Add Food
                </Button>
              </Flex>

              {/* Foods Table */}
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Food</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Calories</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Protein</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Carbs</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Fat</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Serving Size</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {paginatedFoods.map((food) => (
                      <Table.Row key={food.id}>
                        <Table.Cell>
                          <Text weight="medium">{food.name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" color="blue">{food.category}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{food.calories}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{food.protein}g</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{food.carbs}g</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{food.fat}g</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{food.servingSize}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2">
                            <IconButton size="1" variant="ghost">
                              <EyeOpenIcon />
                            </IconButton>
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
              </Card>
            </Flex>
          </Tabs.Content>

          {/* Assign Diet Tab */}
          <Tabs.Content value="assign">
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Heading size="4">Diet Assignments</Heading>
                <Button onClick={() => setShowAssignDialog(true)}>
                  <PlusIcon /> Assign Diet
                </Button>
              </Flex>

              {/* Assignments Table */}
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Student</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Foods Count</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Assigned By</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {mockDietAssignments.map((assignment) => (
                      <Table.Row key={assignment.id}>
                        <Table.Cell>
                          <Text weight="medium">{assignment.studentName}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" color="green">
                            {assignment.foods.length} foods
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="1">
                            {new Date(assignment.fromDate).toLocaleDateString()} - {new Date(assignment.toDate).toLocaleDateString()}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{assignment.assignedBy}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2">
                            <IconButton size="1" variant="ghost">
                              <EyeOpenIcon />
                            </IconButton>
                            <IconButton size="1" variant="ghost">
                              <Pencil1Icon />
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card>

              {/* Detailed Diet View */}
              {mockDietAssignments.length > 0 && (
                <Card>
                  <Heading size="4" mb="4">Diet Plan Details - {mockDietAssignments[0].studentName}</Heading>
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Food</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Breakfast</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Morning Snack</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Lunch</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Evening Snack</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Dinner</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {mockDietAssignments[0].foods.map((food, idx) => (
                        <Table.Row key={idx}>
                          <Table.Cell>
                            <Text weight="medium">{food.foodName}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox checked={food.breakfast} disabled />
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox checked={food.morningSnack} disabled />
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox checked={food.lunch} disabled />
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox checked={food.eveningSnack} disabled />
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox checked={food.dinner} disabled />
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{food.quantity || "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card>
              )}
            </Flex>
          </Tabs.Content>
        </Tabs.Root>

        {/* Add Food Dialog */}
        <Dialog.Root open={showAddFoodDialog} onOpenChange={setShowAddFoodDialog}>
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>Add New Food</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Add a new food item to the database.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Food Name
                  </Text>
                  <TextField.Root placeholder="Enter food name" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Category
                  </Text>
                  <Select.Root>
                    <Select.Trigger placeholder="Select category" />
                    <Select.Content>
                      <Select.Item value="protein">Protein</Select.Item>
                      <Select.Item value="carbohydrates">Carbohydrates</Select.Item>
                      <Select.Item value="vegetables">Vegetables</Select.Item>
                      <Select.Item value="fruits">Fruits</Select.Item>
                      <Select.Item value="dairy">Dairy</Select.Item>
                      <Select.Item value="nuts">Nuts</Select.Item>
                      <Select.Item value="grains">Grains</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>
              
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Calories (per 100g)
                  </Text>
                  <TextField.Root type="number" placeholder="Calories" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Protein (g)
                  </Text>
                  <TextField.Root type="number" placeholder="Protein" />
                </Box>
              </Flex>
              
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Carbs (g)
                  </Text>
                  <TextField.Root type="number" placeholder="Carbohydrates" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Fat (g)
                  </Text>
                  <TextField.Root type="number" placeholder="Fat" />
                </Box>
              </Flex>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Serving Size
                </Text>
                <TextField.Root placeholder="e.g., 100g, 1 cup, 1 piece" />
              </Box>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button>Add Food</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Assign Diet Dialog */}
        <Dialog.Root open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>Assign Diet Plan</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Assign a diet plan to a student with meal timing.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Student
                </Text>
                <Select.Root>
                  <Select.Trigger placeholder="Select student" />
                  <Select.Content>
                    <Select.Item value="1">John Doe</Select.Item>
                    <Select.Item value="2">Jane Smith</Select.Item>
                    <Select.Item value="3">Mike Johnson</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    From Date
                  </Text>
                  <TextField.Root type="date" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    To Date
                  </Text>
                  <TextField.Root type="date" />
                </Box>
              </Flex>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button>Assign Diet</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
