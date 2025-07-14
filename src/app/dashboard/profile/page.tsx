"use client";

import { useState } from "react";
import { 
  Box, 
  Flex, 
  Heading, 
  Button,
  TextField,
  Select,
  Card,
  Text,
  Separator,
  Avatar,
  TextArea,
  Tabs
} from "@radix-ui/themes";
import { 
  Pencil1Icon,
  CheckIcon,
  Cross1Icon,
  CameraIcon
} from "@radix-ui/react-icons";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  joinDate: string;
  membershipStatus: string;
  // Fitness related fields for members
  fitnessGoal?: string;
  fitnessLevel?: string;
  preferredWorkoutTime?: string;
  medicalConditions?: string;
  // Trainer specific fields
  specialization?: string;
  experience?: string;
  certifications?: string[];
}

const mockUser: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  role: "user",
  dateOfBirth: "1990-05-15",
  gender: "male",
  address: "123 Main St, City, State 12345",
  emergencyContact: "Jane Doe",
  emergencyPhone: "(555) 987-6543",
  joinDate: "2024-01-15",
  membershipStatus: "active",
  fitnessGoal: "lose_weight",
  fitnessLevel: "beginner",
  preferredWorkoutTime: "morning",
  medicalConditions: "None"
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(mockUser);
  const [editedData, setEditedData] = useState(mockUser);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    // Mock API call
    setProfileData(editedData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "user": return "Member";
      case "trainer": return "Trainer";
      case "admin": return "Administrator";
      default: return role;
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
          <Heading size="6">Profile</Heading>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Pencil1Icon /> Edit Profile
            </Button>
          ) : (
            <Flex gap="2">
              <Button variant="soft" color="gray" onClick={handleCancel}>
                <Cross1Icon /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <CheckIcon /> Save Changes
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Profile Header Card */}
        <Card>
          <Flex align="center" gap="6" wrap="wrap">
            <Box style={{ position: 'relative' }}>
              <Avatar 
                size="8" 
                fallback={profileData.name.substring(0, 2)}
                style={{ fontSize: '2rem' }}
              />
              {isEditing && (
                <Button 
                  size="1" 
                  variant="soft"
                  style={{ 
                    position: 'absolute', 
                    bottom: '-8px', 
                    right: '-8px',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <CameraIcon />
                </Button>
              )}
            </Box>
            <Box style={{ flex: 1 }}>
              <Heading size="5" mb="2">{profileData.name}</Heading>
              <Flex direction="column" gap="1">
                <Text size="3" color="gray">{getRoleDisplay(profileData.role)}</Text>
                <Text size="2" color="gray">{profileData.email}</Text>
                <Flex align="center" gap="2">
                  <Text size="2">Status:</Text>
                  <Text size="2" color={getStatusColor(profileData.membershipStatus)}>
                    {profileData.membershipStatus}
                  </Text>
                </Flex>
                <Text size="2" color="gray">
                  Member since {new Date(profileData.joinDate).toLocaleDateString()}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Card>

        {/* Profile Details */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="personal">Personal Info</Tabs.Trigger>
            <Tabs.Trigger value="contact">Contact & Emergency</Tabs.Trigger>
            {profileData.role === 'user' && (
              <Tabs.Trigger value="fitness">Fitness Info</Tabs.Trigger>
            )}
            {profileData.role === 'trainer' && (
              <Tabs.Trigger value="professional">Professional Info</Tabs.Trigger>
            )}
          </Tabs.List>

          {/* Personal Information Tab */}
          <Tabs.Content value="personal">
            <Card>
              <Flex direction="column" gap="4">
                <Heading size="4">Personal Information</Heading>
                <Separator size="4" />
                
                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Full Name
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        value={editedData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <Text>{profileData.name}</Text>
                    )}
                  </Box>
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Email
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        type="email"
                        value={editedData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <Text>{profileData.email}</Text>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Phone Number
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <Text>{profileData.phone}</Text>
                    )}
                  </Box>
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Date of Birth
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        type="date"
                        value={editedData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <Text>{new Date(profileData.dateOfBirth).toLocaleDateString()}</Text>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Gender
                  </Text>
                  {isEditing ? (
                    <Select.Root 
                      value={editedData.gender} 
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="male">Male</Select.Item>
                        <Select.Item value="female">Female</Select.Item>
                        <Select.Item value="other">Other</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  ) : (
                    <Text style={{ textTransform: 'capitalize' }}>{profileData.gender}</Text>
                  )}
                </Box>

                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Address
                  </Text>
                  {isEditing ? (
                    <TextArea
                      value={editedData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Text>{profileData.address}</Text>
                  )}
                </Box>
              </Flex>
            </Card>
          </Tabs.Content>

          {/* Contact & Emergency Tab */}
          <Tabs.Content value="contact">
            <Card>
              <Flex direction="column" gap="4">
                <Heading size="4">Contact & Emergency Information</Heading>
                <Separator size="4" />
                
                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Emergency Contact Name
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        value={editedData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      />
                    ) : (
                      <Text>{profileData.emergencyContact}</Text>
                    )}
                  </Box>
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Emergency Contact Phone
                    </Text>
                    {isEditing ? (
                      <TextField.Root
                        type="tel"
                        value={editedData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      />
                    ) : (
                      <Text>{profileData.emergencyPhone}</Text>
                    )}
                  </Box>
                </Flex>
              </Flex>
            </Card>
          </Tabs.Content>

          {/* Fitness Information Tab (Members only) */}
          {profileData.role === 'user' && (
            <Tabs.Content value="fitness">
              <Card>
                <Flex direction="column" gap="4">
                  <Heading size="4">Fitness Information</Heading>
                  <Separator size="4" />
                  
                  <Flex gap="4" wrap="wrap">
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Fitness Goal
                      </Text>
                      {isEditing ? (
                        <Select.Root 
                          value={editedData.fitnessGoal} 
                          onValueChange={(value) => handleInputChange('fitnessGoal', value)}
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Item value="lose_weight">Lose Weight</Select.Item>
                            <Select.Item value="build_muscle">Build Muscle</Select.Item>
                            <Select.Item value="get_more_flexible">Get More Flexible</Select.Item>
                            <Select.Item value="learn_the_basics">Learn The Basics</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      ) : (
                        <Text style={{ textTransform: 'capitalize' }}>
                          {profileData.fitnessGoal?.replace('_', ' ')}
                        </Text>
                      )}
                    </Box>
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Fitness Level
                      </Text>
                      {isEditing ? (
                        <Select.Root 
                          value={editedData.fitnessLevel} 
                          onValueChange={(value) => handleInputChange('fitnessLevel', value)}
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Item value="beginner">Beginner</Select.Item>
                            <Select.Item value="intermediate">Intermediate</Select.Item>
                            <Select.Item value="advanced">Advanced</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      ) : (
                        <Text style={{ textTransform: 'capitalize' }}>{profileData.fitnessLevel}</Text>
                      )}
                    </Box>
                  </Flex>

                  <Box>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Preferred Workout Time
                    </Text>
                    {isEditing ? (
                      <Select.Root 
                        value={editedData.preferredWorkoutTime} 
                        onValueChange={(value) => handleInputChange('preferredWorkoutTime', value)}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="morning">Morning</Select.Item>
                          <Select.Item value="afternoon">Afternoon</Select.Item>
                          <Select.Item value="evening">Evening</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    ) : (
                      <Text style={{ textTransform: 'capitalize' }}>{profileData.preferredWorkoutTime}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Medical Conditions / Notes
                    </Text>
                    {isEditing ? (
                      <TextArea
                        value={editedData.medicalConditions}
                        onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                        rows={3}
                        placeholder="Enter any medical conditions or special notes"
                      />
                    ) : (
                      <Text>{profileData.medicalConditions || "None"}</Text>
                    )}
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>
          )}

          {/* Professional Information Tab (Trainers only) */}
          {profileData.role === 'trainer' && (
            <Tabs.Content value="professional">
              <Card>
                <Flex direction="column" gap="4">
                  <Heading size="4">Professional Information</Heading>
                  <Separator size="4" />
                  
                  <Flex gap="4" wrap="wrap">
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Specialization
                      </Text>
                      {isEditing ? (
                        <TextField.Root
                          value={editedData.specialization || ""}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          placeholder="e.g., Weight Training, Yoga, Cardio"
                        />
                      ) : (
                        <Text>{profileData.specialization || "Not specified"}</Text>
                      )}
                    </Box>
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Experience
                      </Text>
                      {isEditing ? (
                        <TextField.Root
                          value={editedData.experience || ""}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          placeholder="e.g., 5 years"
                        />
                      ) : (
                        <Text>{profileData.experience || "Not specified"}</Text>
                      )}
                    </Box>
                  </Flex>
                </Flex>
              </Card>
            </Tabs.Content>
          )}
        </Tabs.Root>
      </Flex>
    </Box>
  );
}
