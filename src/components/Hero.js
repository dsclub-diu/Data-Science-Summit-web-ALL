'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Sparkles } from 'lucide-react';

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-full">
      <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-0.5 rounded-lg">
        <div className="bg-white dark:bg-slate-900 rounded-lg px-3 py-4 md:px-4 md:py-6 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-blue-400/10 to-cyan-400/0 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tabular-nums transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500 dark:group-hover:text-cyan-300">
              {String(value).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2">
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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="w-full flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 md:py-12 md:pt-32 relative z-10"
      style={{ minHeight: 'calc(100vh)' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] max-w-full rounded-full bg-cyan-500/10 dark:bg-purple-500/10 blur-3xl animate-float-glow"></div>

      <div className="w-full max-w-5xl text-center relative">
        {/* Theme chip */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Theme 2026 · AI in Entrepreneurship
          </span>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-4xl py-2 md:py-0 md:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
            5th<br className="block md:hidden" /> National Data Science{' '}
            <br className="block md:hidden" /> Summit
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-gray-300 font-semibold mt-3 md:mt-4">
            Where Data Skills Meet Entrepreneurial Vision
          </p>
        </div>

        {/* ★ Prize Pool Banner ★ */}
        <div className="mb-10 md:mb-12 flex justify-center">
          <div className="relative w-full max-w-3xl rounded-2xl p-0.5 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-2xl shadow-cyan-500/20">
            <div className="rounded-[14px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl px-6 py-7 md:px-10 md:py-8 overflow-hidden">
              {/* shine sweep */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                    <Trophy className="h-7 w-7 md:h-8 md:w-8" />
                  </span>
                  <div className="text-left">
                    <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-gray-400">
                      Total Prize Pool
                    </p>
                    <p className="text-4xl md:text-6xl font-extrabold leading-none bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-shine">
                      ৳80,000
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-px h-16 bg-slate-200 dark:bg-white/10"></div>
                <p className="max-w-xs text-sm md:text-base text-slate-600 dark:text-gray-300 font-medium text-center md:text-left">
                  Compete across hackathons, project showcases & more — and win
                  big at the nation&apos;s premier data science event.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date / Location */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 mb-10 md:mb-14 text-slate-600 dark:text-gray-300 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span>July 12, 2026 | 9:00 AM - 5:00 PM</span>
          </div>
          <div className="hidden sm:block w-0.5 h-4 bg-linear-to-b from-cyan-400 to-transparent opacity-50"></div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span>Daffodil Smart City, Birulia, Savar, Dhaka</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-8 md:mb-12">
          <p className="text-base md:text-lg text-slate-700 dark:text-gray-200 font-semibold mb-5 md:mb-6">
            Opening In!
          </p>
          <div className="w-1/2 md:w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>

        {/* CTA */}
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
