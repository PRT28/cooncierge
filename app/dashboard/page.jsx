"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { getRandomBgTextClass, getRandomDarkBgClass } from "../../utils/helper";
import Calender from "../../components/Calender";
import { useCalendar } from "../../context/CalendarContext";

const Dashboard = () => {
  const { calenderShow, setCalenderShow } = useCalendar();
  const [summaryData, setSummaryData] = React.useState({});
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];

  // useEffect(() => {
  //   const fetchSummaryData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/logs/get-user-logs/689000000000000000000003",
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             authorization: localStorage.getItem("token"),
  //           },
  //         }
  //       );
  //       setSummaryData(response.data);
  //     } catch (err) {
  //       console.error(
  //         "API not available, running in UI-only mode:",
  //         err.message
  //       );
  //       setSummaryData({ currentUserPendingTaskCount: 0 }); // fallback
  //     }
  //   };

  //   fetchSummaryData();
  // }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const month = d.toLocaleString("default", { month: "short" });
    console.log(month, "month");
    return `${day}${suffix} ${month}`;
  };

  return (
    <div className="transition-all duration-500 ease-in-out flex-1 ml-[44px] scale-100 w-[95vw] pl-[3%] mt-10">
      {!calenderShow && (
        <div className="flex flex-col items-start self-stretch rounded-[16px] border border-gray-100 bg-white shadow-sm w-[100%]">
          <div className="flex justify-between items-center w-[100%] px-5 py-4 border-b border-[#E2E1E1]">
            {summaryData?.currentUserPendingTaskCount === 0 && (
              <div className="flex items-center h-8 px-4 py-2 rounded-full bg-[#DCFCE7] text-[#166534] font-poppins text-base font-semibold leading-8">
                Hurrah! You are up to Date
              </div>
            )}
            {summaryData?.currentUserPendingTaskCount !== 0 && (
              <div className="flex items-center h-8 px-4 py-2 rounded-full bg-[#fcdcdc] text-[#651616] font-poppins text-base font-semibold leading-8">
                Pending Tasks: {summaryData?.currentUserPendingTaskCount}
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="flex items-center justify-center h-10 px-5 py-2 rounded-lg bg-[#114958] text-white text-center font-poppins text-base font-normal leading-6"
              >
                Tasks +
              </button>
              <button
                type="button"
                onClick={() => setCalenderShow(!calenderShow)}
                className="flex items-center justify-center h-10 px-5 py-2 rounded-lg border border-[#114958] bg-white text-[#114958] text-center font-poppins text-base font-normal leading-6"
              >
                {calenderShow ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>
          <div className="flex w-[100%] px-5 py-4">
            <div className="flex justify-between items-center gap-4 w-full flex-wrap">
              {summaryData.dateWiseLogs &&
                Object.keys(summaryData.dateWiseLogs).map((date, index) => {
                  const data = summaryData.dateWiseLogs[date];
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-64 rounded-xl bg-[#F9FAFB] border border-gray-200 shadow-sm p-4`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                          {formatDate(date)}
                        </h3>
                        <span className="text-gray-400">👁</span>
                      </div>
                      <ul className="space-y-2">
                        {data.map((task, i) => (
                          <li
                            key={i}
                            className={`text-sm font-medium px-3 py-1 rounded-full ${getRandomBgTextClass()}`}
                          >
                            {task.activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {!calenderShow && (
        <div className="flex gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow w-1/3">
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
                />
              </div>
            </div>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex justify-between">
                <span>Completed</span>
                <span className="text-green-500 font-semibold">
                  {summaryData?.percentageLogs?.completedCount}
                </span>
              </li>
              <li className="flex justify-between">
                <span>In Progress</span>
                <span className="text-blue-500 font-semibold">
                  {summaryData?.percentageLogs?.inProgressCount}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Pending</span>
                <span className="text-orange-500 font-semibold">
                  {summaryData?.percentageLogs?.pendingCount}
                </span>
              </li>
            </ul>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div
                className="h-full bg-teal-900 rounded-full"
                style={{ width: summaryData?.percentageLogs?.completedPercent }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {summaryData?.percentageLogs?.completedPercent} completion rate
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Team Performance
              </h2>
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-green-700">
                👥
              </div>
            </div>
            {summaryData.teamPercentCompleteLogs &&
              Object.keys(summaryData.teamPercentCompleteLogs).map(
                (member, idx) => {
                  const color = getRandomDarkBgClass();
                  return (
                    <div key={idx} className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-6 h-6 text-white font-medium flex items-center justify-center rounded-full ${color}`}
                        >
                          {member[0]}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {member}
                        </span>
                        <span className="ml-auto text-gray-700 font-medium">
                          {summaryData.teamPercentCompleteLogs[member]}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{
                            width: `${summaryData.teamPercentCompleteLogs[member]}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Activity
              </h2>
              <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                🕒
              </div>
            </div>
            {summaryData.recentLogs &&
              summaryData.recentLogs.map((item, idx) => {
                const color = getRandomDarkBgClass();

                return (
                  <div key={idx} className="flex flex-col items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${color}`}></span>
                      <span className="font-semibold text-gray-800">
                        {item.activity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 pl-4">
                      {item.dateTime}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {calenderShow && (
        <Calender
          setCalenderShow={setCalenderShow}
          calenderShow={calenderShow}
        />
      )}
    </div>
  );
};

export default Dashboard;
