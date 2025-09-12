"use client";
import { createContext, useContext, useState } from "react";

const CalendarContext = createContext();
export const useCalendar = () => useContext(CalendarContext);

export function CalendarProvider({ children }) {
  const [calenderShow, setCalenderShow] = useState(false);
  return (
    <CalendarContext.Provider value={{ calenderShow, setCalenderShow }}>
      {children}
    </CalendarContext.Provider>
  );
}
