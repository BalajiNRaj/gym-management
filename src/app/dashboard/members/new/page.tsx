'use client';

import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Card, 
  TextField, 
  Select, 
  Button, 
  Grid,
  Separator
} from '@radix-ui/themes';
import { ArrowLeftIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function AddMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'gain_weight',
    level: 'beginner',
    address: '',
    emergencyContact: '',
    medicalConditions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
  };

  return (
    <Box>
      <Flex align="center" gap="3" mb="6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/members">
            <ArrowLeftIcon /> Back to Members
          </Link>
        </Button>
        <Separator orientation="vertical" size="2" />
        <PersonIcon />
        <Heading size="5">Add New Member</Heading>
      </Flex>

      <Card size="4">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="6">
            {/* Personal Information */}
            <Box>
              <Heading size="3" mb="4">Personal Information</Heading>
              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Full Name *</Text>
                  <TextField.Root
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Email Address *</Text>
                  <TextField.Root
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Phone Number</Text>
                  <TextField.Root
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Age</Text>
                  <TextField.Root
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </Flex>
              </Grid>
            </Box>

            <Separator size="4" />

            {/* Physical Information */}
            <Box>
              <Heading size="3" mb="4">Physical Information</Heading>
              <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Weight (kg)</Text>
                  <TextField.Root
                    type="number"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Height (cm)</Text>
                  <TextField.Root
                    type="number"
                    placeholder="Enter height"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Gender</Text>
                  <Select.Root 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <Select.Trigger placeholder="Select gender" />
                    <Select.Content>
                      <Select.Item value="male">Male</Select.Item>
                      <Select.Item value="female">Female</Select.Item>
                      <Select.Item value="other">Other</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Fitness Level</Text>
                  <Select.Root 
                    value={formData.level} 
                    onValueChange={(value) => handleInputChange('level', value)}
                  >
                    <Select.Trigger placeholder="Select level" />
                    <Select.Content>
                      <Select.Item value="beginner">Beginner</Select.Item>
                      <Select.Item value="intermediate">Intermediate</Select.Item>
                      <Select.Item value="advanced">Advanced</Select.Item>
                      <Select.Item value="expert">Expert</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Grid>
            </Box>

            <Separator size="4" />

            {/* Goals and Preferences */}
            <Box>
              <Heading size="3" mb="4">Goals and Preferences</Heading>
              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Fitness Goal</Text>
                  <Select.Root 
                    value={formData.goal} 
                    onValueChange={(value) => handleInputChange('goal', value)}
                  >
                    <Select.Trigger placeholder="Select goal" />
                    <Select.Content>
                      <Select.Item value="gain_weight">Gain Weight</Select.Item>
                      <Select.Item value="lose_weight">Lose Weight</Select.Item>
                      <Select.Item value="build_muscle">Build Muscle</Select.Item>
                      <Select.Item value="get_fit">Get Fit</Select.Item>
                      <Select.Item value="maintain">Maintain Health</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Address</Text>
                  <TextField.Root
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Flex>
              </Grid>
            </Box>

            <Separator size="4" />

            {/* Emergency and Medical Information */}
            <Box>
              <Heading size="3" mb="4">Emergency & Medical Information</Heading>
              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Emergency Contact</Text>
                  <TextField.Root
                    placeholder="Emergency contact name and phone"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  />
                </Flex>
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">Medical Conditions</Text>
                  <TextField.Root
                    placeholder="Any medical conditions or notes"
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  />
                </Flex>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Flex gap="3" justify="end" pt="4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/members">Cancel</Link>
              </Button>
              <Button type="submit">Add Member</Button>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
