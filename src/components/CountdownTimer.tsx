import { useState, useEffect } from "react";

const CountdownTimer = () => {
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
    <div className="flex gap-2 sm:gap-4 justify-center lg:justify-start">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center bg-primary/10 rounded-lg px-2 py-1.5 sm:px-4 sm:py-3 min-w-[55px] sm:min-w-[80px]">
      <span className="text-3xl md:text-4xl font-bold text-primary">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
};

export default CountdownTimer;
