import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, CalendarDays } from "lucide-react";

export default function Countdown() {
  const weddingDate = new Date("2026-11-20T17:00:00+05:30"); // Sangeet starts Nov 20, 2026 5:00 PM IST
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +weddingDate - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days, id: "days" },
    { label: "Hours", value: timeLeft.hours, id: "hours" },
    { label: "Min", value: timeLeft.minutes, id: "mins" },
    { label: "Sec", value: timeLeft.seconds, id: "secs" }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4" id="countdown-timer-section">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 backdrop-blur-md bg-white/40 border border-white/60 text-wedding-magenta rounded-full text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs">
          <CalendarDays className="w-3.5 h-3.5" />
          Countdown
        </div>
        <h3 className="font-serif text-lg md:text-xl text-wedding-burgundy tracking-wide">
          The Celebration Begins In
        </h3>
      </motion.div>
 
      {/* Modern Retro Triple Pane Grid Countdown */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg w-full">
        {timeBlocks.map((block, idx) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-panel-sm hover:border-white rounded-[24px] p-2.5 sm:p-5 text-center relative overflow-hidden transition-all duration-300 shadow-xl shadow-rose-100/40"
            id={`countdown-block-${block.id}`}
          >
            {/* Subtle floral watermark bg */}
            <div className="absolute right-0 bottom-0 w-8 h-8 opacity-5 text-wedding-pink-dark">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 5 8 8.5 5 9C8 9.5 11.5 13 12 16C12.5 13 16 9.5 19 9C16 8.5 12.5 5 12 2Z"/>
              </svg>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.span
                key={block.value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="block font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-wedding-burgundy leading-none tracking-tight mb-1 sm:mb-2"
              >
                {String(block.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>

            <span className="text-[9px] sm:text-[11px] uppercase tracking-widest font-sans font-medium text-wedding-magenta/80">
              {block.label}
            </span>
          </motion.div>
        ))}
      </div>

      {timeLeft.isOver && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center text-wedding-magenta font-serif text-lg font-semibold italic animate-pulse"
        >
          ✨ The wedding celebration has commenced! ✨
        </motion.div>
      )}

      {/* Date banner wrapper bottom */}
      <div className="mt-6 flex items-center gap-2 text-zinc-500 text-xs sm:text-sm font-sans tracking-wide">
        <Clock className="w-4 h-4 text-wedding-magenta/70" />
        <span>November 20 - 21, 2026 • Bengaluru, India</span>
      </div>
    </div>
  );
}
