"use client";

import { useRouter } from "next/navigation";
import { Box, Card, Table, Button } from "@radix-ui/themes";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  goal?: string;
  level?: string;
}

interface UserClientProps {
  user: User;
}

export default function UserClient({ user }: UserClientProps) {
  const router = useRouter();

  return (
    <Box style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "24px" }}>
        {/* Image Section */}
        <Box>
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={400}
              height={300}
              style={{
                borderRadius: "12px",
                width: "100%",
                height: "300px",
                objectFit: "cover"
              }}
            />
          ) : (
            <Box
              style={{
                width: "100%",
                height: "300px",
                background: "var(--gray-3)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gray-9)"
              }}
            >
              No Image Available
            </Box>
          )}
        </Box>

        {/* Details Section */}
        <Card style={{ padding: "24px" }}>
          <Table.Root>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ fontWeight: "bold" }}>Name</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell style={{ fontWeight: "bold" }}>Email</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell style={{ fontWeight: "bold" }}>Role</Table.Cell>
                <Table.Cell style={{ textTransform: "capitalize" }}>{user.role}</Table.Cell>
              </Table.Row>
              {user.age && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Age</Table.Cell>
                  <Table.Cell>{user.age} years</Table.Cell>
                </Table.Row>
              )}
              {user.weight && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Weight</Table.Cell>
                  <Table.Cell>{user.weight} kg</Table.Cell>
                </Table.Row>
              )}
              {user.height && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Height</Table.Cell>
                  <Table.Cell>{user.height} cm</Table.Cell>
                </Table.Row>
              )}
              {user.gender && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Gender</Table.Cell>
                  <Table.Cell style={{ textTransform: "capitalize" }}>{user.gender}</Table.Cell>
                </Table.Row>
              )}
              {user.goal && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Goal</Table.Cell>
                  <Table.Cell style={{ textTransform: "capitalize" }}>
                    {user.goal.split("_").join(" ")}
                  </Table.Cell>
                </Table.Row>
              )}
              {user.level && (
                <Table.Row>
                  <Table.Cell style={{ fontWeight: "bold" }}>Level</Table.Cell>
                  <Table.Cell style={{ textTransform: "capitalize" }}>{user.level}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Card>
      </Box>

      <Button
        variant="solid"
        color="green"
        onClick={() => router.back()}
        style={{ marginTop: "16px" }}
      >
        Go Back
      </Button>
    </Box>
  );
}
