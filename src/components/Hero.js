'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-full">
      <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-0.5 rounded-lg">
        <div className="bg-slate-900 rounded-lg px-3 py-4 md:px-4 md:py-6 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-blue-400/10 to-cyan-400/0 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tabular-nums transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300">
              {String(value).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wider mt-2">
      {label}
    </p>
  </div>
);

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set target date to July 12, 2026 at midnight
      const targetDate = new Date('2026-07-12T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately on mount
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full flex items-center justify-center px-2 sm:px-3 md:px-4 py-8 md:py-12 md:pt-35 relative z-10" style={{ minHeight: 'calc(100vh )' }}>
      <div className="w-full max-w-5xl text-center">
        {/* Main Heading */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-sm md:text-2xl text-cyan-300 font-bold mb-2 md:mb-3 tracking-wider uppercase opacity-90">
            AI in Entrepreneurship
          </h3>
          <h1 className="text-4xl py-3 md:py-0 md:text-5xl lg:text-7xl font-bold text-white mb-2 md:mb-4 leading-tight">
            5th<br className='block md:hidden' /> National Data Science <br className='block md:hidden' /> Summit
          </h1>
          <p className="text-base md:text-lg text-gray-300 font-semibold mt-3 md:mt-4">
            Get Ready to Show Your Data Skills
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 mb-10 md:mb-14 text-gray-300 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 011-1h6a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V6a2 2 0 012-2h4V2z" />
            </svg>
            <span>July 12, 2026 | 9:00 AM - 5:00 PM</span>
          </div>
          <div className="hidden sm:block w-0.5 h-4 bg-linear-to-b from-cyan-400 to-transparent opacity-50"></div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Daffodil Smart City, Birulai, Savar, Dhaka</span>
          </div>
        </div>

        {/* Opening In Text */}
        <div className="mb-8 md:mb-12">
          <p className="text-base md:text-lg text-gray-200 font-semibold mb-5 md:mb-6">
            Opening In!
          </p>

          {/* Countdown Timer */}
          <div className="w-1/2 md:w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-8 md:mt-10">
          <Link href="#events">
            <button className="bg-linear-to-r from-cyan-400 to-blue-500 text-white px-6 md:px-10 py-3 md:py-4 font-bold text-base md:text-lg rounded-lg hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Register Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
