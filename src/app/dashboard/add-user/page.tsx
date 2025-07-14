"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  Box, 
  Flex, 
  Heading, 
  Card, 
  Text,
  TextField,
  Select,
  Button,
  Separator,
  Grid
} from "@radix-ui/themes";
import { ArrowLeftIcon, UpdateIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

const AddMemberPage = () => {
  const { data: session, status } = useSession();
  const sessionUser = session?.user as SessionUser;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React hooks must be called before any conditional returns
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      image: "",

      age: 18,
      weight: 50,
      height: 150,
      gender: "male",
      goal: "gain_weight",
      level: "beginner"
    }
  });

  const image = watch("image");
  const role = watch("role");

  // Authentication checks come after hooks
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    router.push('/signin');
    return null;
  }

  const isAdminOrTrainer = sessionUser?.role === "admin" || sessionUser?.role === "trainer";
  
  if (!isAdminOrTrainer) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      if (response.status === 201) {
        toast.success("User Created Successfully");
        reset();
        router.push("/dashboard/members");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create user";
      console.error("Error creating user:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Heading size="6">Add New Member</Heading>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid columns="2" gap="6">
            {/* Image Upload */}
            <Box>
              <Card style={{ padding: "16px" }}>
                <Flex direction="column" gap="4">
                  <Heading size="4">Profile Picture</Heading>
                  <Separator size="4" />
                  <ImageUpload setValue={setValue} value={image} />
                </Flex>
              </Card>
            </Box>

            {/* Basic Information */}
            <Box>
              <Card style={{ padding: "16px" }}>
                <Flex direction="column" gap="4">
                  <Heading size="4">Basic Information</Heading>
                  <Separator size="4" />
                  
                  <Flex gap="4" wrap="wrap">
                    <Box style={{ flex: 1, minWidth: '200px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Full Name *
                      </Text>
                      <TextField.Root
                        placeholder="Enter full name"
                        {...register("name", { 
                          required: "Name is required" 
                        })}
                      />
                      {errors.name && (
                        <Text size="1" color="red">
                          {errors.name.message as string}
                        </Text>
                      )}
                    </Box>
                    <Box style={{ flex: 1, minWidth: '200px' }}>
                      <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                        Role *
                      </Text>
                      <Select.Root 
                        {...register("role", { required: true })}
                        onValueChange={(value) => setValue("role", value)}
                      >
                        <Select.Trigger placeholder="Select role" />
                        <Select.Content>
                          {sessionUser?.role === "admin" && (
                            <Select.Item value="trainer">Trainer</Select.Item>
                          )}
                          <Select.Item value="user">Member</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </Flex>

                  <Box>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Email Address *
                    </Text>
                    <TextField.Root
                      type="email"
                      placeholder="Enter email address"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <Text size="1" color="red">
                        {errors.email.message as string}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Password *
                    </Text>
                    <TextField.Root
                      type="password"
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must have at least 8 characters"
                        },
                        maxLength: {
                          value: 20,
                          message: "Password must have at most 20 characters"
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
                          message: "Password must contain at least one uppercase letter, one lowercase letter and one number"
                        }
                      })}
                    />
                    {errors.password && (
                      <Text size="1" color="red">
                        {errors.password.message as string}
                      </Text>
                    )}
                  </Box>
                </Flex>
              </Card>
            </Box>
          </Grid>

          {/* Physical Information */}
          <Card style={{ padding: "16px", marginTop: "24px" }}>
            <Flex direction="column" gap="4">
              <Heading size="4">Physical Information</Heading>
              <Separator size="4" />
              
              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: 1, minWidth: '150px' }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Age *
                  </Text>
                  <TextField.Root
                    type="number"
                    placeholder="Age"
                    {...register("age", {
                      required: "Age is required",
                      min: {
                        value: 18,
                        message: "Age must be at least 18"
                      },
                      valueAsNumber: true
                    })}
                  />
                  {errors.age && (
                    <Text size="1" color="red">
                      {errors.age.message as string}
                    </Text>
                  )}
                </Box>
                <Box style={{ flex: 1, minWidth: '150px' }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Weight (kg) *
                  </Text>
                  <TextField.Root
                    type="number"
                    placeholder="Weight in kg"
                    {...register("weight", {
                      required: "Weight is required",
                      min: {
                        value: 1,
                        message: "Weight must be positive"
                      },
                      valueAsNumber: true
                    })}
                  />
                  {errors.weight && (
                    <Text size="1" color="red">
                      {errors.weight.message as string}
                    </Text>
                  )}
                </Box>
                <Box style={{ flex: 1, minWidth: '150px' }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Height (cm) *
                  </Text>
                  <TextField.Root
                    type="number"
                    placeholder="Height in cm"
                    {...register("height", {
                      required: "Height is required",
                      min: {
                        value: 1,
                        message: "Height must be positive"
                      },
                      valueAsNumber: true
                    })}
                  />
                  {errors.height && (
                    <Text size="1" color="red">
                      {errors.height.message as string}
                    </Text>
                  )}
                </Box>
                <Box style={{ flex: 1, minWidth: '150px' }}>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Gender *
                  </Text>
                  <Select.Root 
                    {...register("gender", { required: true })}
                    onValueChange={(value) => setValue("gender", value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="male">Male</Select.Item>
                      <Select.Item value="female">Female</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>
            </Flex>
          </Card>

          {/* Fitness Information (only for members) */}
          {role === 'user' && (
            <Card style={{ padding: "16px", marginTop: "24px" }}>
              <Flex direction="column" gap="4">
                <Heading size="4">Fitness Information</Heading>
                <Separator size="4" />
                
                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '200px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Fitness Goal
                    </Text>
                    <Select.Root 
                      {...register("goal")}
                      onValueChange={(value) => setValue("goal", value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="gain_weight">Gain Weight</Select.Item>
                        <Select.Item value="lose_weight">Lose Weight</Select.Item>
                        <Select.Item value="get_fitter">Get Fitter</Select.Item>
                        <Select.Item value="get_stronger">Get Stronger</Select.Item>
                        <Select.Item value="get_healthier">Get Healthier</Select.Item>
                        <Select.Item value="get_more_flexible">Get More Flexible</Select.Item>
                        <Select.Item value="get_more_muscular">Get More Muscular</Select.Item>
                        <Select.Item value="learn_the_basics">Learn The Basics</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box style={{ flex: 1, minWidth: '200px' }}>
                    <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '8px' }}>
                      Fitness Level
                    </Text>
                    <Select.Root 
                      {...register("level")}
                      onValueChange={(value) => setValue("level", value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="beginner">Beginner</Select.Item>
                        <Select.Item value="intermediate">Intermediate</Select.Item>
                        <Select.Item value="advanced">Advanced</Select.Item>
                        <Select.Item value="expert">Expert</Select.Item>
                        <Select.Item value="professional">Professional</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Flex>
              </Flex>
            </Card>
          )}

          {/* Submit Buttons */}
          <Flex gap="3" justify="end" style={{ marginTop: "24px" }}>
            <Button 
              type="button" 
              variant="soft" 
              color="gray"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <UpdateIcon className="animate-spin" />
                  Adding Member...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
};

export default AddMemberPage;
