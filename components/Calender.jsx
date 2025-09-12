"use client";

import React, { useEffect } from "react";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const darkClasses = [
  "border-l-blue-700",
  "border-l-green-700",
  "border-l-yellow-700",
  "border-l-purple-700",
  "border-l-red-700",
  "border-l-pink-700",
  "border-l-cyan-700",
  "border-l-orange-700",
  "border-l-lime-700",
  "border-l-gray-700",
  "border-l-indigo-700",
  "border-l-teal-700",
];

export const getRandomBorderClass = () => {
  const randomIndex = Math.floor(Math.random() * darkClasses.length);
  return darkClasses[randomIndex];
};

const getMonthDays = (year, month) => {
  const date = new Date(year, month, 1);
  const startDay = date.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendar = [];
  let week = Array(startDay).fill(null); // Fill leading empty cells

  for (let i = 1; i <= daysInMonth; i++) {
    week.push(i);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // Push trailing empty cells if needed
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  return calendar;
};

export default function Calender({ calenderShow, setCalenderShow }) {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [data, setData] = React.useState({});

  const calendar = getMonthDays(year, month);

  useEffect(() => {
    const fetchSummaryData = async () => {
      const response = await axios.get(
        `http://localhost:8080/logs/monthly-summary/689000000000000000000003?month=${month}&year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      setData(response.data);
    };

    fetchSummaryData();
  }, [month, year]);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full min-h-screen p-6 bg-white text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="text-xl font-bold text-teal-800 px-2 py-1 rounded hover:bg-teal-100"
          >
            ⬅
          </button>
          <h2 className="text-2xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={handleNext}
            className="text-xl font-bold text-teal-800 px-2 py-1 rounded hover:bg-teal-100"
          >
            ➡
          </button>
        </div>
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

      <div className="grid grid-cols-7 border-[#E5E7EB] border-t border-l rounded-lg overflow-hidden">
        {days.map((day) => (
          <div
            key={day}
            className="text-center py-2 font-semibold bg-teal-800 text-white border-[#E5E7EB] border-r border-b"
          >
            {day}
          </div>
        ))}
        {calendar.map((week, weekIdx) =>
          week.map((date, i) => {
            const color = getRandomBorderClass();
            return (
              <div
                key={`${weekIdx}-${i}`}
                className={`h-32 p-1 border-[#E5E7EB] border-r border-b ${
                  date && data[date] ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="text-xs font-semibold text-gray-600">
                  {date ? (
                    <div className="flex justify-between">
                      <span>{date}</span>
                      {data?.logsByDay?.[date] && (
                        <span className="text-gray-400">1 Task</span>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4">
                  {date &&
                    data?.logsByDay?.[date]?.map((task, idx) => (
                      <div
                        key={idx}
                        className={`mt-1 px-2 py-1 rounded-md border-l-4 ${color} bg-white shadow-sm text-xs truncate`}
                      >
                        {task.activity}
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
