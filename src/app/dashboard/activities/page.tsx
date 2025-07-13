import { Box, Flex, Heading, Button, Table, Text, TextField, Card } from '@radix-ui/themes';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

export default function ExercisePage() {
  // In a real app, this would be fetched from an API
  const exercises = [
    { id: 1, name: 'Push-ups', description: 'Upper body strength exercise' },
    { id: 2, name: 'Squats', description: 'Lower body strength exercise' },
    { id: 3, name: 'Plank', description: 'Core stability exercise' },
    { id: 4, name: 'Burpees', description: 'Full body cardio exercise' },
  ];

  return (
    <Box>
      <Heading size="5" mb="6">Exercise Management</Heading>
      
      <Flex gap="6" direction={{ initial: 'column', md: 'row' }}>
        {/* Add Exercise Form */}
        <Card style={{ flex: '0 0 300px' }}>
          <Heading size="3" mb="4">Add New Exercise</Heading>
          <Flex direction="column" gap="3">
            <TextField.Root placeholder="Exercise name" />
            <TextField.Root placeholder="Description" />
            <Button>
              <PlusIcon /> Add Exercise
            </Button>
          </Flex>
        </Card>

        {/* Exercise List */}
        <Box style={{ flex: 1 }}>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Exercise Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {exercises.map((exercise) => (
                <Table.Row key={exercise.id}>
                  <Table.Cell>{exercise.id}</Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{exercise.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray">{exercise.description}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Button variant="soft" color="red" size="1">
                      <TrashIcon /> Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Flex>
    </Box>
  );
}
