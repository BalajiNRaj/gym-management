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
  Tabs
} from "@radix-ui/themes";
import { 
  EyeOpenIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon
} from "@radix-ui/react-icons";

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  instructions: string[];
  createdAt: string;
}

interface ExerciseAssignment {
  id: string;
  memberId: string;
  memberName: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    restTime: number; // in seconds
    notes?: string;
  }[];
  fromDate: string;
  toDate: string;
  assignedBy: string;
  createdAt: string;
}

const mockExercises: Exercise[] = [
  {
    id: "1",
    name: "Push-ups",
    category: "Chest",
    description: "Basic bodyweight chest exercise",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    difficulty: "beginner",
    equipment: "None",
    instructions: [
      "Start in plank position",
      "Lower body until chest nearly touches floor",
      "Push back up to starting position"
    ],
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Deadlift",
    category: "Back",
    description: "Compound exercise for posterior chain",
    targetMuscles: ["Back", "Glutes", "Hamstrings"],
    difficulty: "intermediate",
    equipment: "Barbell",
    instructions: [
      "Stand with feet hip-width apart",
      "Grip barbell with hands outside legs",
      "Lift by driving through heels and extending hips"
    ],
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "Squats",
    category: "Legs",
    description: "Fundamental lower body exercise",
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    difficulty: "beginner",
    equipment: "None/Barbell",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower by bending knees and hips",
      "Return to starting position"
    ],
    createdAt: "2024-01-01"
  }
];

const mockAssignments: ExerciseAssignment[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "John Doe",
    exercises: [
      {
        exerciseId: "1",
        exerciseName: "Push-ups",
        sets: 3,
        reps: 15,
        restTime: 60,
        notes: "Focus on form"
      },
      {
        exerciseId: "3",
        exerciseName: "Squats",
        sets: 3,
        reps: 20,
        restTime: 90
      }
    ],
    fromDate: "2024-01-20",
    toDate: "2024-02-20",
    assignedBy: "Alex Rodriguez",
    createdAt: "2024-01-20"
  }
];

export default function ExercisePage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentPage] = useState(1);
  const [showAddExerciseDialog, setShowAddExerciseDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  const exercisesPerPage = 10;

  const filteredExercises = useMemo(() => {
    return mockExercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || exercise.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || exercise.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "green";
      case "intermediate": return "orange";
      case "advanced": return "red";
      default: return "gray";
    }
  };

  const categories = Array.from(new Set(mockExercises.map(e => e.category)));

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Exercise Management</Heading>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="manage">Manage Exercises</Tabs.Trigger>
            <Tabs.Trigger value="assign">Assign Exercises</Tabs.Trigger>
          </Tabs.List>

          {/* Manage Exercises Tab */}
          <Tabs.Content value="manage">
            <Flex direction="column" gap="4">
              {/* Stats Cards */}
              <Flex gap="4" wrap="wrap">
                <Card style={{ minWidth: '200px' }}>
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Total Exercises</Text>
                    <Text size="6" weight="bold">{mockExercises.length}</Text>
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
                    <Text size="2" color="gray">Active Assignments</Text>
                    <Text size="6" weight="bold" color="green">{mockAssignments.length}</Text>
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
                      placeholder="Search exercises..."
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
                  <Select.Root value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <Select.Trigger placeholder="Filter by difficulty" />
                    <Select.Content>
                      <Select.Item value="all">All Difficulties</Select.Item>
                      <Select.Item value="beginner">Beginner</Select.Item>
                      <Select.Item value="intermediate">Intermediate</Select.Item>
                      <Select.Item value="advanced">Advanced</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <Button onClick={() => setShowAddExerciseDialog(true)}>
                  <PlusIcon /> Add Exercise
                </Button>
              </Flex>

              {/* Exercises Table */}
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Exercise</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Target Muscles</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Difficulty</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Equipment</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {paginatedExercises.map((exercise) => (
                      <Table.Row key={exercise.id}>
                        <Table.Cell>
                          <Box>
                            <Text weight="medium">{exercise.name}</Text>
                            <Text size="1" color="gray">{exercise.description}</Text>
                          </Box>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" color="blue">{exercise.category}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="1">{exercise.targetMuscles.join(", ")}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={getDifficultyColor(exercise.difficulty)} variant="soft">
                            {exercise.difficulty}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{exercise.equipment}</Text>
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

          {/* Assign Exercises Tab */}
          <Tabs.Content value="assign">
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Heading size="4">Exercise Assignments</Heading>
                <Button onClick={() => setShowAssignDialog(true)}>
                  <PlusIcon /> Assign Exercise
                </Button>
              </Flex>

              {/* Assignments Table */}
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Exercises</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Assigned By</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {mockAssignments.map((assignment) => (
                      <Table.Row key={assignment.id}>
                        <Table.Cell>
                          <Text weight="medium">{assignment.memberName}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex direction="column" gap="1">
                            {assignment.exercises.map((ex, idx) => (
                              <Text key={idx} size="1">
                                {ex.exerciseName} - {ex.sets}x{ex.reps}
                              </Text>
                            ))}
                          </Flex>
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
            </Flex>
          </Tabs.Content>
        </Tabs.Root>

        {/* Add Exercise Dialog */}
        <Dialog.Root open={showAddExerciseDialog} onOpenChange={setShowAddExerciseDialog}>
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>Add New Exercise</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Create a new exercise for the exercise library.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Exercise Name
                  </Text>
                  <TextField.Root placeholder="Enter exercise name" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Category
                  </Text>
                  <Select.Root>
                    <Select.Trigger placeholder="Select category" />
                    <Select.Content>
                      <Select.Item value="chest">Chest</Select.Item>
                      <Select.Item value="back">Back</Select.Item>
                      <Select.Item value="legs">Legs</Select.Item>
                      <Select.Item value="shoulders">Shoulders</Select.Item>
                      <Select.Item value="arms">Arms</Select.Item>
                      <Select.Item value="core">Core</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>
              
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                  Description
                </Text>
                <TextField.Root placeholder="Enter exercise description" />
              </Box>
              
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Difficulty
                  </Text>
                  <Select.Root>
                    <Select.Trigger placeholder="Select difficulty" />
                    <Select.Content>
                      <Select.Item value="beginner">Beginner</Select.Item>
                      <Select.Item value="intermediate">Intermediate</Select.Item>
                      <Select.Item value="advanced">Advanced</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Equipment
                  </Text>
                  <TextField.Root placeholder="Required equipment" />
                </Box>
              </Flex>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button>Add Exercise</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Assign Exercise Dialog */}
        <Dialog.Root open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>Assign Exercise</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Assign exercises to a member with specific parameters.
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
              <Button>Assign Exercises</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
