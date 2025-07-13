"use client";

import React from "react";
import AppWidgetSummary from "../ui/AppWidgetSummary";
import AttendanceGraph from "./AttendanceGraph";
import TodayGraph from "./TodayGraph";
import Loader from "../ui/Loader";
import { PersonIcon } from "@radix-ui/react-icons";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AdminTrainerDashboardProps {
  user: User;
}

// Mock data - replace with real API calls
const mockData = {
  fees: {
    income: 25000,
    unpaid: 5000,
  },
  users: {
    onlineUsers: 45,
    students: 120,
    count: 150,
  },
  attendances: {
    data: Array.from({ length: 30 }, (_, i) => ({
      id: `attendance-${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isPresent: Math.random() > 0.3,
    }))
  }
};

const AdminTrainerDashboard: React.FC<AdminTrainerDashboardProps> = ({ user }) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.role === "admin" && (
          <>
            <AppWidgetSummary
              title="Income"
              total={`$${mockData.fees.income}`}
              color="blue"
              icon={<span className="text-2xl">💰</span>}
            />
            <AppWidgetSummary
              title="Unpaid"
              total={`$${mockData.fees.unpaid}`}
              color="yellow"
              icon={<span className="text-2xl">💰</span>}
            />
          </>
        )}
        
        <AppWidgetSummary
          title="Active Now"
          total={`${mockData.users.onlineUsers}`}
          color="green"
          icon={<PersonIcon width={32} height={32} />}
        />
        
        <AppWidgetSummary
          title="Students"
          total={`${mockData.users.students}`}
          color="yellow"
          icon={<PersonIcon width={32} height={32} />}
        />
        
        <AppWidgetSummary
          title="Users"
          total={`${mockData.users.count}`}
          color="red"
          icon={<PersonIcon width={32} height={32} />}
        />
      </div>

      <hr className="my-8" />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border h-64">
            <AttendanceGraph attendanceData={mockData.attendances.data} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border h-64">
            <TodayGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrainerDashboard;
