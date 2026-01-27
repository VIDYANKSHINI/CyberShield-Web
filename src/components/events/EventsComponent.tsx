// src/components/events/EventsComponent.tsx
import React, { useState, useRef, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { type EventItem } from "@/types/events";
import { CalendarShim } from "@/components/events/ui/Calendar";
import { DetailedEventCard } from "@/components/events/ui/Card";

interface EventsHeroProps {
  events: EventItem[];
}

const EventsComponent: React.FC<EventsHeroProps> = ({ events = [] }) => {
  // Default to today
  const todayISO = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);

  // Refs for animation context
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  // Filter events for the selected date
  const selectedEvents = useMemo(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  // --- GSAP Animation ---
  useGSAP(
    () => {
      if (!detailsPanelRef.current) return;
      gsap.set(detailsPanelRef.current, { clearProps: "all" });
      gsap.fromTo(
        detailsPanelRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    },
    { dependencies: [selectedDate], scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      // FIX 1: Added 'py-24' (or min-h-screen with centering) to prevent blending with Hero/Footer
      // This ensures the component has its own "stage" and doesn't touch the edges.
      className="relative w-full min-h-screen bg-white font-['Manrope'] flex items-center justify-center py-24 px-4 md:px-8 lg:px-12"
    >
      {/* Container Wrapper 
         FIX 2: Created a constrained "Card" or "Wrapper" for the whole component.
         This centers the entire layout on the screen and gives it structure.
      */}
      <div className="w-full max-w-360 bg-white overflow-hidden flex flex-col lg:flex-row min-h-screen lg:h-200">
        {/* LEFT COLUMN: Navigation & Calendar 
          FIX 3: Increased width share (lg:w-[40%]) so it doesn't look cramped.
        */}
        <div className="w-full lg:w-[40%] xl:w-[35%] bg-white border-r border-zinc-100 flex flex-col relative z-20">
          <div className="p-8 lg:p-10 h-full flex flex-col">
            {/* Header Area */}
            <div className="mb-6 shrink-0">
              <h1 className="text-3xl lg:text-4xl font-['Syne'] font-bold text-black tracking-tight mb-2">
                Events
              </h1>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
                Select a date to view the agenda.
              </p>
            </div>

            {/* Calendar Container 
               FIX 4: Used 'flex-1' and 'justify-center' to vertically align the calendar 
               so it floats perfectly between header and footer, avoiding the "crushed" look.
            */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <CalendarShim
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>

            {/* Footer / Meta */}
            {/* <div className="mt-6 pt-6 border-t border-zinc-100 text-xs text-zinc-400 flex-shrink-0 flex justify-between items-center">
              <span>© 2026 CyberShield</span>
              <span>All times local</span>
            </div> */}
          </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Details Pane 
          FIX 5: Keeps 'flex-1' to take remaining space, but uses 'overflow-hidden' on parent
          to force the scrollable area inside.
        */}
        <div className="flex-1 bg-zinc-50/50 relative flex flex-col h-full overflow-hidden">
          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-100 h-100 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />

          {/* Scrollable Content Area 
             FIX 6: This is the nested scroll container. 
          */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10 custom-scrollbar">
            <header className="mb-10 flex items-end justify-between border-b border-zinc-200 pb-4 sticky top-0 bg-zinc-50/95 backdrop-blur-sm z-20 pt-2">
              <div>
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Schedule For
                </h2>
                <p className="text-3xl font-['Syne'] font-bold text-zinc-900">
                  {format(parseISO(selectedDate), "EEEE, MMM do")}
                </p>
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-full">
                  {selectedEvents.length} Events
                </span>
              </div>
            </header>

            <div ref={detailsPanelRef} className="min-h-50">
              {selectedEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-12">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
                    <CalendarIcon className="w-6 h-6 opacity-30" />
                  </div>
                  <p className="text-lg font-medium text-zinc-500">
                    No events scheduled
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 max-w-2xl">
                  {selectedEvents.map((event) => (
                    <DetailedEventCard key={event.id} event={event} />
                  ))}
                  {/* Space at bottom to prevent cutoff when scrolling */}
                  <div className="h-12" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Optional: Custom styling for the nested scrollbar to make it subtle */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          /* iOS Safari fix for viewport height */
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
        }
        
        /* Optional: Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }
 `}</style>
    </section>
  );
};

export default EventsComponent;
