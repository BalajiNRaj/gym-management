'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  Card, 
  Text,
  Avatar,
  Badge
} from '@radix-ui/themes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  age?: number;
  gender?: string;
  goal?: string;
  level?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

const UserProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const sessionUser = session?.user as SessionUser;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user profile');
      router.push('/dashboard/members');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (session?.user && params.id) {
      fetchUser();
    }
  }, [session?.user, params.id, fetchUser]);

  // Authentication checks
  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    router.push('/signin');
    return null;
  }

  const isAdminOrTrainer = sessionUser?.role === "admin" || sessionUser?.role === "trainer";
  const isOwnProfile = sessionUser?.id === params.id;
  
  if (!isAdminOrTrainer && !isOwnProfile) {
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

  if (!user) {
    return (
      <Box style={{ padding: '2rem', textAlign: 'center' }}>
        <Heading size="5">User Not Found</Heading>
        <Text color="gray">The user you&apos;re looking for doesn&apos;t exist.</Text>
        <Button asChild style={{ marginTop: '1rem' }}>
          <Link href="/dashboard/members">Back to Members</Link>
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex align="center" gap="4">
          <Button variant="ghost" size="2" asChild>
            <Link href="/dashboard/members">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <Heading size="6">User Profile</Heading>
        </Flex>

        {/* User Info Card */}
        <Card style={{ padding: "24px" }}>
          <Flex direction="column" gap="6">
            <Flex align="center" gap="4">
              <Avatar
                size="6"
                src={user.image}
                fallback={user.name?.charAt(0) || "U"}
              />
              <Box>
                <Heading size="5">{user.name}</Heading>
                <Text color="gray" size="3">{user.email}</Text>
                <Badge 
                  color={
                    user.role === 'admin' ? 'red' : 
                    user.role === 'trainer' ? 'blue' : 'green'
                  }
                  variant="soft"
                  style={{ marginTop: '4px' }}
                >
                  {user.role === 'user' ? 'Student' : 
                   user.role === 'trainer' ? 'Trainer' : 'Admin'}
                </Badge>
              </Box>
            </Flex>

            {/* User Details */}
            <Box>
              <Heading size="4" style={{ marginBottom: '16px' }}>Details</Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <Text weight="medium">Status:</Text>
                  <Text>{user.isActive ? "🟢 Active" : "🔴 Inactive"}</Text>
                </Flex>
                {user.age && (
                  <Flex justify="between">
                    <Text weight="medium">Age:</Text>
                    <Text>{user.age} years</Text>
                  </Flex>
                )}
                {user.gender && (
                  <Flex justify="between">
                    <Text weight="medium">Gender:</Text>
                    <Text style={{ textTransform: 'capitalize' }}>{user.gender}</Text>
                  </Flex>
                )}
                {user.goal && (
                  <Flex justify="between">
                    <Text weight="medium">Goal:</Text>
                    <Text style={{ textTransform: 'capitalize' }}>
                      {user.goal.replace('_', ' ')}
                    </Text>
                  </Flex>
                )}
                {user.level && (
                  <Flex justify="between">
                    <Text weight="medium">Level:</Text>
                    <Text style={{ textTransform: 'capitalize' }}>{user.level}</Text>
                  </Flex>
                )}
                {user.createdAt && (
                  <Flex justify="between">
                    <Text weight="medium">Member Since:</Text>
                    <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>

            {/* Actions */}
            <Flex gap="3" justify="end">
              <Button variant="soft" asChild>
                <Link href="/dashboard/members">Back to Members</Link>
              </Button>
              {isAdminOrTrainer && (
                <Button asChild>
                  <Link href={`/dashboard/user/${user._id}/edit`}>Edit Profile</Link>
                </Button>
              )}
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};

export default UserProfilePage;
