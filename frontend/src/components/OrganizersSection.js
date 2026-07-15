"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from "next/image";

export default function OrganizersSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainer = useRef(null);

  const organizers = [
    { id: 1, name: '', img: '/5.png' },
    { id: 2, name: '', img: '/9.png' },
  ];

  // ✅ FIXED — UNIQUE IDs FOR ALL
  const mediaPartners = [
    { id: 1, name: '', img: '/1.png' },
    { id: 2, name: '', img: '/2.png' },
    { id: 3, name: '', img: '/3.png' },
    { id: 4, name: '', img: '/4.png' },
    { id: 5, name: '', img: '/6.png' },
    { id: 6, name: '', img: '/7.png' },
    { id: 7, name: '', img: '/8.png' },
    { id: 8, name: '', img: '/10.png' },
    { id: 9, name: '', img: '/11.png' },
    { id: 10, name: '', img: '/12.png' },
    { id: 11, name: '', img: '/13.png' },
  ];

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollContainer.current.scrollLeft -= scrollAmount;
      } else {
        scrollContainer.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <section className="w-full py-24 md:py-32 px-4 relative z-10 bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">

        {/* Organizers Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
                <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white">
                  Organizers
                </h2>
              </div>
            </div>
          </div>

          {/* Organizers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-center items-center max-w-2xl mx-auto">
            {organizers.map((org) => (
              <div
                key={org.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <Image
                    src={org.img}
                    alt={org.name}
                    width={200}
                    height={200}
                    className="mx-auto object-contain"
                  />
                  <p className="text-slate-600 dark:text-gray-300 font-semibold">{org.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Partners Section */}
        <div>

          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
                <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white">
                  Partners
                </h2>
              </div>
            </div>
          </div>

          {/* Media Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mediaPartners.map((media) => (
              <div
                key={media.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <Image
                    src={media.img}
                    alt={media.name}
                    width={200}
                    height={200}
                    className="mx-auto mb-2 object-contain"
                  />
                  <p className="text-slate-600 dark:text-gray-300 font-semibold text-xs md:text-sm">{media.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
