"use client";

import { Card, Box, Heading, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

interface AppWidgetSummaryProps {
  title: string;
  total: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
  icon: ReactNode;
}

const colorMap = {
  blue: 'var(--blue-9)',
  green: 'var(--green-9)', 
  yellow: 'var(--yellow-9)',
  red: 'var(--red-9)'
};

export default function AppWidgetSummary({ 
  title, 
  total, 
  color, 
  icon 
}: AppWidgetSummaryProps) {
  return (
    <Card
      style={{
        padding: "24px",
        textAlign: "center",
        color: "white",
        background: colorMap[color],
        borderRadius: "12px",
        border: "none"
      }}
    >
      <Box
        style={{
          margin: "0 auto 16px auto",
          display: "flex",
          borderRadius: "50%",
          alignItems: "center",
          width: "80px",
          height: "80px",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        {icon}
      </Box>

      <Heading size="6" style={{ marginBottom: "8px", color: "white" }}>
        {total}
      </Heading>

      <Text size="3" style={{ opacity: 0.8, color: "white" }}>
        {title}
      </Text>
    </Card>
  );
}
