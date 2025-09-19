"use client";

import dynamic from "next/dynamic";
import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { getRandomBgTextClass, getRandomDarkBgClass } from "@/utils/helper";
import { useCalendar } from "@/context/CalendarContext";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";
import ModalSkeleton from "@/components/skeletons/ModalSkeleton";
import SidesheetSkeleton from "@/components/skeletons/SidesheetSkeleton";

const Calendar = dynamic(() => import("@/components/Calendar"), {
  loading: () => <CalendarSkeleton />,
  ssr: false,
});

const BookingFormModal = dynamic(() => import("@/components/BookingFormModal"), {
  loading: () => <ModalSkeleton />,
  ssr: false,
});

const BookingFormSidesheet = dynamic(
  () => import("@/components/BookingFormSidesheet"),
  {
    loading: () => <SidesheetSkeleton />,
    ssr: false,
  }
);

type TaskLog = {
  activity: string;
  dateTime: string;
  status?: 'completed' | 'in-progress' | 'pending';
  [key: string]: unknown;
};

interface PercentageLogs {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  completedPercent: string;
}

interface SummaryData {
  currentUserPendingTaskCount: number;
  dateWiseLogs?: Record<string, TaskLog[]>;
  percentageLogs?: PercentageLogs;
  teamPercentCompleteLogs?: Record<string, number>;
  recentLogs?: TaskLog[];
}

const DashboardContent: React.FC = () => {
  const { calenderShow, setCalenderShow } = useCalendar();
  const {
    state,
    openModal,
    closeModal,
    closeSidesheet,
    selectService,
  } = useBooking();
  const [summaryData, setSummaryData] = useState<SummaryData>({
    currentUserPendingTaskCount: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    
    const getSuffix = (day: number): string => {
      if (day % 10 === 1 && day !== 11) return "st";
      if (day % 10 === 2 && day !== 12) return "nd";
      if (day % 10 === 3 && day !== 13) return "rd";
      return "th";
    };
    
    const suffix = getSuffix(day);
    const month = date.toLocaleString("default", { month: "short" });
    
    return `${day}${suffix} ${month}`;
  }, []);

  const fetchSummaryData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<SummaryData>(
        "http://localhost:8080/logs/get-user-logs/689000000000000000000003",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          timeout: 10000,
        }
      );
      
      setSummaryData(response.data);
    } catch (err) {
      console.error("API not available, running in UI-only mode:", err);
      setError("Failed to load dashboard data");
      setSummaryData({ currentUserPendingTaskCount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCalendar = useCallback(() => {
    setCalenderShow(!calenderShow);
  }, [calenderShow, setCalenderShow]);

  const statusBadge = useMemo(() => {
    const pendingCount = summaryData.currentUserPendingTaskCount;
    
    if (pendingCount === 0) {
      return (
        <div className="flex items-center h-8 px-4 py-2 rounded-full bg-[#DCFCE7] text-[#166534] font-poppins text-base font-semibold leading-8">
          Hurrah! You are up to Date
        </div>
      );
    }
    
    return (
      <div className="flex items-center h-8 px-4 py-2 rounded-full bg-[#fcdcdc] text-[#651616] font-poppins text-base font-semibold leading-8">
        Pending Tasks: {pendingCount}
      </div>
    );
  }, [summaryData.currentUserPendingTaskCount]);

  const dateWiseLogsCards = useMemo(() => {
    if (!summaryData.dateWiseLogs) return null;
    
    return Object.entries(summaryData.dateWiseLogs).map(([date, logs], index) => (
      <div
        key={`${date}-${index}`}
        className="flex-shrink-0 w-64 rounded-xl bg-[#F9FAFB] border border-gray-200 shadow-sm p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">
            {formatDate(date)}
          </h3>
          <span className="text-gray-400" role="img" aria-label="view">👁</span>
        </div>
        <ul className="space-y-2">
          {logs.map((task, i) => (
            <li
              key={`${date}-${i}`}
              className={`text-sm font-medium px-3 py-1 rounded-full ${getRandomBgTextClass()}`}
            >
              {task.activity}
            </li>
          ))}
        </ul>
      </div>
    ));
  }, [summaryData.dateWiseLogs, formatDate]);

  const teamPerformanceCards = useMemo(() => {
    if (!summaryData.teamPercentCompleteLogs) return null;
    
    return Object.entries(summaryData.teamPercentCompleteLogs).map(([member, percentage], idx) => {
      const color = getRandomDarkBgClass();
      
      return (
        <div key={`${member}-${idx}`} className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-6 h-6 text-white font-medium flex items-center justify-center rounded-full ${color}`}
            >
              {member[0]?.toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">{member}</span>
            <span className="ml-auto text-gray-700 font-medium">
              {percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full ${color} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    });
  }, [summaryData.teamPercentCompleteLogs]);

  const recentActivityItems = useMemo(() => {
    if (!summaryData.recentLogs) return null;
    
    return summaryData.recentLogs.map((item, idx) => {
      const color = getRandomDarkBgClass();
      
      return (
        <div key={`${item.activity}-${idx}`} className="flex flex-col items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="font-semibold text-gray-800">
              {item.activity}
            </span>
          </div>
          <p className="text-xs text-gray-400 pl-4">
            {item.dateTime}
          </p>
        </div>
      );
    });
  }, [summaryData.recentLogs]);

  return (
    <div className="transition-all duration-500 ease-in-out space-y-6">
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      )}
      {!calenderShow && (
        <>
          <div className="flex flex-col items-start self-stretch rounded-[16px] border border-gray-100 bg-white shadow-sm">
            <div className="flex justify-between items-center w-[100%] px-5 py-4 border-b border-[#E2E1E1]">
              {statusBadge}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex items-center justify-center h-10 px-5 py-2 rounded-lg bg-[#114958] text-white text-center font-poppins text-base font-normal leading-6 hover:bg-[#0d3a45] transition-colors"
                >
                  Tasks +
                </button>
                <button
                  type="button"
                  onClick={toggleCalendar}
                  className="flex items-center justify-center h-10 px-5 py-2 rounded-lg border border-[#114958] bg-white text-[#114958] text-center font-poppins text-base font-normal leading-6 hover:bg-gray-50 transition-colors"
                >
                  {calenderShow ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>
            
            <div className="flex w-full px-5 py-4">
              <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                {dateWiseLogsCards}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Task Overview */}
            <div className="bg-white p-6 rounded-xl shadow flex-1 min-w-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Task Overview
                </h2>
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="accent-green-500"
                    aria-label="Task overview status"
                  />
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex justify-between">
                  <span>Completed</span>
                  <span className="text-green-500 font-semibold">
                    {summaryData.percentageLogs?.completedCount || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>In Progress</span>
                  <span className="text-blue-500 font-semibold">
                    {summaryData.percentageLogs?.inProgressCount || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Pending</span>
                  <span className="text-orange-500 font-semibold">
                    {summaryData.percentageLogs?.pendingCount || 0}
                  </span>
                </li>
              </ul>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full bg-teal-900 rounded-full transition-all duration-500"
                  style={{ 
                    width: summaryData.percentageLogs?.completedPercent || '0%' 
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                {summaryData.percentageLogs?.completedPercent || '0%'} completion rate
              </p>
            </div>

            {/* Team Performance */}
            <div className="bg-white p-6 rounded-xl shadow flex-1 min-w-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Team Performance
                </h2>
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-green-700">
                  <span role="img" aria-label="team">👥</span>
                </div>
              </div>
              {teamPerformanceCards}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow flex-1 min-w-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Activity
                </h2>
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                  <span role="img" aria-label="clock">🕒</span>
                </div>
              </div>
              {recentActivityItems}
            </div>
          </div>
        </>
      )}
      
      {calenderShow && (
        <Calendar
          setCalenderShow={setCalenderShow}
          calenderShow={calenderShow}
        />
      )}

      {/* Booking Components */}
      {state.isModalOpen && (
        <BookingFormModal
          isOpen={state.isModalOpen}
          onClose={closeModal}
          onSelectedService={selectService}
        />
      )}

      {state.isSidesheetOpen && (
        <BookingFormSidesheet
          isOpen={state.isSidesheetOpen}
          onClose={closeSidesheet}
          selectedService={state.selectedService}
        />
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <BookingProvider>
      <DashboardContent />
    </BookingProvider>
  );
};

export default React.memo(Dashboard);
