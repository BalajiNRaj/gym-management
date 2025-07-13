"use client";

import { Box } from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";

const Loader = () => {
  return (
    <Box 
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}
    >
      <ReloadIcon 
        className="animate-spin" 
        style={{ 
          width: "48px", 
          height: "48px", 
          color: "var(--blue-9)" 
        }} 
      />
    </Box>
  );
};

export default Loader;
