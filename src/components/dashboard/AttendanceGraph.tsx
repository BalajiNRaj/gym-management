"use client";

import { Box, Heading } from "@radix-ui/themes";

interface AttendanceData {
  id: string;
  date: string;
  isPresent: boolean;
}

interface AttendanceGraphProps {
  attendanceData?: AttendanceData[];
}

const AttendanceGraph: React.FC<AttendanceGraphProps> = ({ attendanceData = [] }) => {
  // Process attendance data to create chart data
  const timeSlots: string[] = [];
  attendanceData?.forEach(attendance => {
    if (!timeSlots.includes(attendance.date)) {
      timeSlots.push(attendance.date);
    }
  });

  const presentCounts = timeSlots?.map((timeSlot: string) =>
    attendanceData.filter((attendance: AttendanceData) => 
      attendance?.isPresent && attendance?.date === timeSlot
    ).length
  );
  
  const absentCounts = timeSlots?.map((timeSlot: string) =>
    attendanceData.filter((attendance: AttendanceData) => 
      !attendance?.isPresent && attendance?.date === timeSlot
    ).length
  );

  return (
    <Box>
      <Heading size="4" style={{ marginBottom: "16px" }}>
        Attendance Graph
      </Heading>
      
      {/* Simple bar chart representation */}
      <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {timeSlots.slice(0, 7).map((timeSlot, index) => (
          <Box key={timeSlot} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box style={{ width: "80px", fontSize: "12px" }}>
              {new Date(timeSlot).toLocaleDateString()}
            </Box>
            <Box style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <Box
                style={{
                  width: `${(presentCounts[index] || 0) * 10 + 20}px`,
                  height: "20px",
                  background: "var(--green-9)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px"
                }}
              >
                {presentCounts[index] || 0}
              </Box>
              <Box
                style={{
                  width: `${(absentCounts[index] || 0) * 10 + 20}px`,
                  height: "20px",
                  background: "var(--red-9)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px"
                }}
              >
                {absentCounts[index] || 0}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Box style={{ display: "flex", gap: "16px", marginTop: "16px", fontSize: "12px" }}>
        <Box style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Box style={{ width: "12px", height: "12px", background: "var(--green-9)", borderRadius: "2px" }} />
          Present
        </Box>
        <Box style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Box style={{ width: "12px", height: "12px", background: "var(--red-9)", borderRadius: "2px" }} />
          Absent
        </Box>
      </Box>
    </Box>
  );
};

export default AttendanceGraph;
