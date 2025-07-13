"use client";

import { Box, Heading, Text, Button } from "@radix-ui/themes";
import Link from "next/link";

interface EmptyProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const Empty: React.FC<EmptyProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters",
  showReset,
}) => {
  return (
    <Box
      style={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        textAlign: "center"
      }}
    >
      <Heading size="6">{title}</Heading>
      <Text color="gray" size="4">{subtitle}</Text>

      {showReset && (
        <Box style={{ marginTop: "16px" }}>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Empty;
