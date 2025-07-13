"use client";

import { Box, Heading } from "@radix-ui/themes";

interface AttendanceData {
  id: string;
  date: string;
  isPresent: boolean;
}

interface TodayGraphProps {
  attendanceData?: AttendanceData[];
}

const TodayGraph: React.FC<TodayGraphProps> = ({ attendanceData = [] }) => {
  const today = new Date().toISOString().split("T")[0];
  
  const todayPresent = attendanceData?.filter((attendance: AttendanceData) => 
    attendance?.isPresent && attendance.date === today
  ).length || 0;
  
  const todayAbsent = attendanceData?.filter((attendance: AttendanceData) => 
    !attendance?.isPresent && attendance.date === today
  ).length || 0;

  const total = todayPresent + todayAbsent;
  const presentPercentage = total > 0 ? (todayPresent / total) * 100 : 0;
  const absentPercentage = total > 0 ? (todayAbsent / total) * 100 : 0;

  return (
    <Box>
      <Heading size="4" style={{ marginBottom: "16px" }}>
        Today&apos;s Attendance
      </Heading>
      
      {/* Simple pie chart representation */}
      <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <Box
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `conic-gradient(var(--green-9) 0deg ${presentPercentage * 3.6}deg, var(--red-9) ${presentPercentage * 3.6}deg 360deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <Box
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--color-background)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px"
            }}
          >
            <div style={{ fontWeight: "bold" }}>{total}</div>
            <div>Total</div>
          </Box>
        </Box>
        
        <Box style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
          <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Box style={{ width: "12px", height: "12px", background: "var(--green-9)", borderRadius: "2px" }} />
            Present: {todayPresent} ({presentPercentage.toFixed(0)}%)
          </Box>
          <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Box style={{ width: "12px", height: "12px", background: "var(--red-9)", borderRadius: "2px" }} />
            Absent: {todayAbsent} ({absentPercentage.toFixed(0)}%)
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TodayGraph;
