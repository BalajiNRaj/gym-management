"use client";

import React from "react";
import AppWidgetSummary from "../ui/AppWidgetSummary";
import AttendanceGraph from "./AttendanceGraph";
import Loader from "../ui/Loader";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UserDashboardProps {
  user: User;
}

// Mock data - replace with real API calls
const mockData = {
  fees: {
    paid: 1200,
    unpaid: 300,
  },
  attendances: {
    data: Array.from({ length: 30 }, (_, i) => ({
      id: `attendance-${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isPresent: Math.random() > 0.3,
    }))
  }
};

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [isLoading] = React.useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const handleActiveStatus = (status: string) => {
    console.log(`Setting user status to: ${status}`);
    // Implement status change logic
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, Welcome back
          </h1>
          <span className="text-xl text-gray-600">{user.name}</span>
        </div>
        
        <select 
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          defaultValue={user.isActive ? "online" : "offline"}
          onChange={(e) => handleActiveStatus(e.target.value)}
        >
          <option value="online">🟢 Online</option>
          <option value="offline">🔴 Offline</option>
        </select>
      </div>

      <hr className="my-8" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AppWidgetSummary
          title="Paid"
          total={`$${mockData.fees.paid}`}
          color="blue"
          icon={<span className="text-2xl">💰</span>}
        />
        
        <AppWidgetSummary
          title="Unpaid"
          total={`$${mockData.fees.unpaid}`}
          color="yellow"
          icon={<span className="text-2xl">💰</span>}
        />
      </div>

      <hr className="my-8" />

      {/* Attendance Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border h-64">
          <AttendanceGraph attendanceData={mockData.attendances.data} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
