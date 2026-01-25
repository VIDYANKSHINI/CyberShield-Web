import React, { useState, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

// --- Types ---
type Event = {
  date: Date;
  id: string;
  icon: string;
  color?: string;
};

// --- Data ---
const EVENTS: Event[] = [
  {
    date: new Date(2026, 1, 2),
    id: "linear",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/97/Linear_logo.svg",
    color: "#5E6AD2",
  },
  {
    date: new Date(2026, 1, 7),
    id: "airbnb",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    color: "#FF5A5F",
  },
  {
    date: new Date(2026, 1, 7),
    id: "make",
    icon: "https://assets-global.website-files.com/6410ebf8e483b5bb2c86eb27/6410ebf8e483b5758186fbd8_ABM%20College%20Web%20developer%20main.jpg",
    color: "#6d0ccc",
  },
  {
    date: new Date(2026, 1, 11),
    id: "supabase",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Supabase_Logo.png",
    color: "#3ECF8E",
  },
  {
    date: new Date(2026, 1, 12),
    id: "jetbrains",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/1a/JetBrains_Logo_2016.svg",
    color: "#FE3366",
  },
  {
    date: new Date(2026, 1, 12),
    id: "discord",
    icon: "https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    color: "#5865F2",
  },
  {
    date: new Date(2026, 1, 15),
    id: "spotify",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    color: "#1DB954",
  },
  {
    date: new Date(2026, 1, 15),
    id: "webflow",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Webflow_logo.svg",
    color: "#4353FF",
  },
  {
    date: new Date(2026, 1, 24),
    id: "linkedin",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    color: "#0077B5",
  },
  {
    date: new Date(2026, 1, 27),
    id: "netflix",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    color: "#E50914",
  },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2026, 1, 12),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Ensure we always have 42 days (6 weeks)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  if (calendarDays.length < 42) {
    const remaining = 42 - calendarDays.length;
    const lastDay = calendarDays[calendarDays.length - 1];
    for (let i = 1; i <= remaining; i++) {
      calendarDays.push(
        new Date(
          lastDay.getFullYear(),
          lastDay.getMonth(),
          lastDay.getDate() + i,
        ),
      );
    }
  }

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // --- Animations ---
  useGSAP(() => {
    if (!gridRef.current) return;

    const days = gridRef.current.children;
    const dir = directionRef.current; // 1 = Next, -1 = Prev

    // Kill any running animations on these elements to prevent conflicts
    gsap.killTweensOf(days);

    // WIPE EFFECT:
    // If going Next (dir > 0): Ripple from Top-Left (index 0) to Bottom-Right
    // If going Prev (dir < 0): Ripple from Bottom-Right (last index) to Top-Left

    gsap.fromTo(
      days,
      {
        y: dir * 10, // Slight vertical movement
        opacity: 0,
        scale: 0.9,
        filter: "blur(2px)",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.4,
        stagger: {
          each: 0.02, // Fixed time per element for uniformity
          from: dir > 0 ? 0 : "end", // 0 = start (top-left), "end" = last index (bottom-right)
          grid: [6, 7], // Inform GSAP of the grid layout for smarter calculation
          // Animate across both axes
        },
        ease: "power2.out",
      },
    );
  }, [currentDate]);

  const handleMonthChange = (dir: "prev" | "next") => {
    directionRef.current = dir === "next" ? 1 : -1;
    setCurrentDate(
      dir === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1),
    );
  };

  const handleDayClick = (day: Date, isCurrentMonth: boolean) => {
    // Optional: Prevent clicking days outside current month
    if (!isCurrentMonth) return;

    setSelectedDate(day);
    // Precise mechanical click effect
    gsap.fromTo(
      `.day-${format(day, "yyyy-MM-dd")}`,
      { scale: 0.9 },
      { scale: 1, duration: 0.4, ease: "back.out(2)" },
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
      `}</style>

      <div className="flex w-full min-h-screen items-center justify-center bg-[#F2F2F2] px-4 py-10 antialiased font-['Manrope'] selection:bg-black selection:text-white">
        {/* Main Card */}
        <div
          ref={containerRef}
          className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] p-6 overflow-hidden border border-zinc-100"
        >
          {/* --- Header --- */}
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">
                {format(currentDate, "yyyy")}
              </span>
              <h2 className="text-4xl font-['Syne'] font-bold text-black tracking-tight leading-none">
                {format(currentDate, "MMMM")}
              </h2>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => handleMonthChange("prev")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 hover:bg-black hover:border-black hover:text-white transition-all duration-300 active:scale-90"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => handleMonthChange("next")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 hover:bg-black hover:border-black hover:text-white transition-all duration-300 active:scale-90"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* --- Weekdays --- */}
          <div className="grid grid-cols-7 mb-3">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold text-zinc-300 uppercase tracking-widest"
              >
                {d}
              </div>
            ))}
          </div>

          {/* --- Calendar Grid (Fixed Height) --- */}
          <div
            ref={gridRef}
            className="grid grid-cols-7 grid-rows-6 gap-2 h-[380px]"
          >
            {calendarDays.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected =
                selectedDate && isSameDay(day, selectedDate) && isCurrentMonth;
              const isTodayDate = isToday(day);
              const dayEvents = EVENTS.filter((e) => isSameDay(e.date, day));
              const hasEvents = dayEvents.length > 0;
              const formattedDate = format(day, "yyyy-MM-dd");

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day, isCurrentMonth)}
                  className={cn(
                    `day-${formattedDate}`,
                    "relative w-full h-full rounded-xl flex flex-col items-center justify-center transition-all duration-300 border border-transparent",
                    // --- Dynamic Styling Based on State ---
                    isCurrentMonth
                      ? "cursor-pointer hover:bg-zinc-50"
                      : "opacity-30 cursor-default text-zinc-200 pointer-events-none", // Greyed out logic
                    isSelected &&
                      "bg-black hover:bg-black shadow-lg scale-105 z-10",
                  )}
                >
                  {/* Top Right Arrow for Active States */}
                  {isSelected && (
                    <ArrowUpRight
                      size={12}
                      className="absolute top-2 right-2 text-zinc-500"
                    />
                  )}

                  {/* Date Number */}
                  <span
                    className={cn(
                      "text-sm font-semibold relative z-10",
                      isSelected ? "text-white" : "",
                      !isSelected && isCurrentMonth ? "text-zinc-700" : "",
                      !isCurrentMonth && "text-zinc-300", // Extra faint for inactive days
                      isTodayDate &&
                        !isSelected &&
                        isCurrentMonth &&
                        "text-indigo-600 font-bold",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Event Dots (Only visible for current month) */}
                  {isCurrentMonth && (
                    <div className="flex gap-1 mt-1.5 h-1.5">
                      {dayEvents.map((ev, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            isSelected ? "bg-zinc-500" : "bg-black",
                          )}
                          style={{ opacity: isSelected ? 1 : 0.3 }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Tooltip Hover (Only for current month) */}
                  {hasEvents && !isSelected && isCurrentMonth && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-white border border-zinc-100 opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
                      <img
                        src={dayEvents[0].icon}
                        className="w-5 h-5 opacity-80"
                        alt="event"
                      />
                      {dayEvents.length > 1 && (
                        <span className="ml-1 text-[9px] font-bold text-zinc-400">
                          +{dayEvents.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span>
              {EVENTS.filter((e) => isSameMonth(e.date, currentDate)).length}{" "}
              Events this month
            </span>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="hover:text-black transition-colors"
            >
              Back to Today
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
