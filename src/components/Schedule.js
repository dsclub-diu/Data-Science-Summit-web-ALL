'use client';

export default function ScheduleSection() {
  const scheduleItems = [
    {
      id: 1,
      title: 'Welcome Seminar',
      description: 'Welcome Seminar - Opening with an introduction to "AI in Business" by leading experts.',
      time: '09:00 AM - 10:00 AM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },

    {
      id: 2,
      title: 'Data Hackathon',
      description: 'Join us for a weekend of coding, innovation, and collaboration to solve real-world problems.',
      time: '11:00 AM - 03:00 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 3,
      title: 'Project Competition',
      description: 'Showcase your projects and compete for prizes with the best teams in the university.',
      time: '10:00 AM - 03:00 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 4,
      title: 'Promptcraft Challenge',
      description: 'Test your creativity and skill in this exciting prompt-based challenge.',
      time: '02:30 AM - 03:30 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 5,
      title: 'Hands-On Workshop',
      description: 'Participate in hands-on workshops covering various topics in technology and innovation.',
      time: '10:30 AM - 11:30 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 6,
      title: 'Idea Poster Presentation',
      description: 'Showcase your research through engaging posters and get feedback from peers and mentors.',
      time: '11:30 AM - 12:45 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 7,
      title: 'Round Table Discussion',
      description: 'Engage with industry experts in a round table discussion on Industry-academia collaboration on AIs future role in Business.',
      time: '02:00 PM - 03:30 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    },
    {
      id: 8,
      title: 'Closing Ceremony & Awards',
      description: 'Celebrate the conclusion of the event with a closing ceremony and awards for outstanding participants.',
      time: '03:30 PM - 04:00 PM',
      date: 'December 11, 2025',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
    }
  ];

  return (
    // bg-linear-to-b from-slate-900 via-slate-950 to-slate-900
    <section
      id="schedule"
      className="w-full py-24 md:py-32 px-4 relative z-10 "
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-24">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
              <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Schedule
              </h2>
            </div>
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Check out our event schedule and plan your day. All events are happening on the same date with detailed timings and locations.
          </p>
        </div>

        {/* Schedule Items - Row wise compact layout */}
        <div className="space-y-4 md:space-y-5">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg border border-gray-700/50 bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl p-5 md:p-6 overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative">
                {/* Top Row: Title and Description */}
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row: Time, Date, Location */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-t border-gray-700/30 pt-4">
                  <div className="flex items-center gap-2 text-gray-300 text-xs md:text-sm">
                    <span className="text-cyan-400 font-semibold">🕒</span>
                    <span className="font-medium text-cyan-400">{item.time}</span>
                  </div>
                  <div className="hidden md:block w-px h-4 bg-gray-700/30"></div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs md:text-sm">
                    <span className="text-cyan-400 font-semibold">📅</span>
                    <span className="font-medium text-cyan-400">{item.date}</span>
                  </div>
                  <div className="hidden md:block w-px h-4 bg-gray-700/30"></div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs md:text-sm">
                    <span className="text-cyan-400 font-semibold">📍</span>
                    <span className="font-medium text-gray-300">{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Timeline Indicator */}
        <div className="lg:hidden mt-12 p-6 rounded-lg border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm text-center">
          <p className="text-cyan-300 font-medium text-sm md:text-base">
            ✨ All events happening on <span className="text-cyan-400 font-semibold">December 11, 2025</span>
          </p>
        </div>
      </div>
    </section>
  );
}