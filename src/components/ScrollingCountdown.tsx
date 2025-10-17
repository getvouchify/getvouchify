import { useState, useEffect } from "react";

const ScrollingCountdown = () => {
  const launchDate = new Date("2025-12-10T00:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div className="fixed top-16 md:top-[120px] left-0 right-0 z-50 bg-primary text-white py-3 shadow-md overflow-hidden">
      <div className="relative flex">
        <div className="flex items-center gap-6 px-4 animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-3 text-sm md:text-base font-bold">
            <span>🚀 LAUNCHING IN:</span>
            <span>{String(timeLeft.days).padStart(2, "0")}d</span>
            <span>:</span>
            <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        </div>
        <div className="flex items-center gap-6 px-4 animate-marquee whitespace-nowrap" aria-hidden="true">
          <div className="flex items-center gap-3 text-sm md:text-base font-bold">
            <span>🚀 LAUNCHING IN:</span>
            <span>{String(timeLeft.days).padStart(2, "0")}d</span>
            <span>:</span>
            <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingCountdown;
