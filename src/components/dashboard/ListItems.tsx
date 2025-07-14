"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DashboardIcon,
  PersonIcon,
  PlusIcon,
  CalendarIcon,
  TokensIcon,
  BarChartIcon,
  HeartIcon,
  BellIcon,
} from "@radix-ui/react-icons";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "user";
}

const ListItems = () => {
  const { data, status } = useSession();
  const user = data?.user as SessionUser;

  if (status === "loading") {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <nav className="p-4 space-y-2">
      {/* Dashboard */}
      <Link 
        href="/dashboard" 
        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <DashboardIcon className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>

      {/* Admin/Trainer specific links */}
      {(user?.role === "admin" || user?.role === "trainer") && (
        <>
          <Link 
            href="/dashboard/add-user"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add User</span>
          </Link>

          {user?.role === "admin" && (
            <Link 
              href="/dashboard/members"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <PersonIcon className="w-5 h-5" />
              <span>Manage User</span>
            </Link>
          )}
        </>
      )}

      {/* Common links */}
      <Link 
        href="/dashboard/trainers"
        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <PersonIcon className="w-5 h-5" />
        <span>Trainers</span>
      </Link>

      {(user?.role === "admin" || user?.role === "trainer") && (
        <>
          <Link 
            href="/dashboard/attendance"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Attendance</span>
          </Link>
        </>
      )}

      <hr className="my-4" />

      {/* Manage Section */}
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Manage
      </div>

      {(user?.role === "admin" || user?.role === "trainer") && (
        <>
          <Link 
            href="/dashboard/fees"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TokensIcon className="w-5 h-5" />
            <span>Fees</span>
          </Link>

          <Link 
            href="/dashboard/exercise"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BarChartIcon className="w-5 h-5" />
            <span>Exercise</span>
          </Link>

          <Link 
            href="/dashboard/diet"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Diet</span>
          </Link>
        </>
      )}

      {/* User specific links */}
      {user?.role === "user" && (
        <>
          <Link 
            href="/dashboard/attendance"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>My Attendance</span>
          </Link>

          <Link 
            href="/dashboard/fees"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TokensIcon className="w-5 h-5" />
            <span>My Fees</span>
          </Link>

          <Link 
            href="/dashboard/exercise"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BarChartIcon className="w-5 h-5" />
            <span>My Exercise</span>
          </Link>

          <Link 
            href="/dashboard/diet"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HeartIcon className="w-5 h-5" />
            <span>My Diet Sheet</span>
          </Link>
        </>
      )}

      {/* Notifications */}
      <Link 
        href="/dashboard/notifications"
        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <BellIcon className="w-5 h-5" />
        <span>Notifications</span>
      </Link>
    </nav>
  );
};

export default ListItems;
