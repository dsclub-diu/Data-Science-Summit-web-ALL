'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Helper function to get event page URL
  const getEventPageUrl = (eventId) => {
    switch (eventId) {
      case 1:
        return '/data-hackathon';
      case 2:
        return '/project-showcase';
      case 3:
        return '/promptcraft';
      case 5:
        return '/research-poster';
      default:
        return '#';
    }
  };

  const events = [
    {
      id: 1,
      title: 'Data Hackathon',
      description: 'Join data enthusiasts, AI experts, and innovators as they come together to tackle real-world problems, push the limits of machine learning, and dive into the exciting world of big data and AI.',
      date: '12.07.2026',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
      tags: ['ML / AI', 'Deep Learning', 'Big Data', 'AI Ethics'],
      time: '11:00 AM - 03:00 PM',
      registerLink: 'https://forms.gle/gRrD5czCCHp6pNMj6',
      presentedBy: 'Data Solution-360',
      event: '5th National Data Science Summit 2026',
      hostedBy: 'Data Science Lab and Department of Software Engineering',
      registrationFee: '৳1,200 per team (2 members)',
      prizes: [
        { place: '1st Place', amount: '15,000/-' },
        { place: '2nd Place', amount: '10,000/-' },
        { place: '3rd Place', amount: '5,000/-' },
      ],
      totalPrizePool: '30,000/-',
      eligibility: 'University, college, and school students (valid student ID required)',
      teamSize: 'Up to 2 members',
      perks: ['Event T-shirt', 'Souvenirs', 'Certificates'],
      whyJoin: [
        'Tackle real-world educational challenges using cutting-edge AI and data science.',
        'Collaborate with the brightest minds and industry leaders.',
        'Gain hands-on experience and build solutions with real impact.',
      ],
    },
    {
      id: 2,
      title: 'Project Showcase Competition',
      description: 'Showcase your innovative projects and compete with others in a high-energy event celebrating tech creativity and practical solutions.',
      date: '12.07.2026',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
      tags: ['Innovation', 'Tech Projects', 'Prototyping', 'Showcase'],
      time: '10:00 AM - 03:00 PM',
      registerLink: 'https://forms.gle/Q16BjVQDSzij6Tc47',
      presentedBy: 'Data Science Lab',
      event: '5th National Data Science Summit 2026',
      hostedBy: 'Data Science Lab and Department of Software Engineering',
      registrationFee: '৳1000 per participant (up to 2 members)',
      prizes: [
        { place: '1st Place', amount: '7,000/-' },
        { place: '2nd Place', amount: '5,000/-' },
        { place: '3rd Place', amount: '3,000/-' },
      ],
      totalPrizePool: '15,000/-',
      eligibility: 'Open to students, researchers, and professionals in data science',
      teamSize: 'Up to 2 members',
      perks: ['Event T-shirt', 'Souvenir'],
      whyJoin: [
        'Present your innovative projects tackling significant educational challenges.',
        'Get feedback from top academic and industry experts.',
        'Stand out with your creativity, methodology, and real-world impact!',
      ],
    },
    {
      id: 3,
      title: 'Promptcraft Challenge',
      description: 'Unleash your creativity by crafting powerful and impactful prompts in this engaging, interactive challenge designed for aspiring creators and innovators.',
      date: '12.07.2026',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
      tags: ['Creativity', 'Prompt Engineering', 'Writing', 'Inovation'],
      time: '2:30 PM - 3:30 PM',
      registerLink: 'https://forms.gle/x7qVwQLmTUmD3hKc6',
      presentedBy: 'Data Science Lab',
      event: '5th National Data Science Summit 2026',
      hostedBy: 'Data Science Lab and Department of Software Engineering',
      registrationFee: '৳200 per participant (Get certificate)',
      prizes: [
        { place: '1st Prize', amount: '4,000/-' },
        { place: '2nd Prize', amount: '3,000/-' },
        { place: '3rd Prize', amount: '2,000/-' },
        { place: '4th Prize', amount: '1,000/-' },
        { place: '5th Prize', amount: '1,000/-' },
      ],
      totalPrizePool: '11,000/-',
      eligibility: 'University, college, and school students (valid student ID required)',
      teamSize: 'Individual only',
      perks: ['Event T-shirt', 'Certificate', 'Snacks'],
      whyJoin: [
        'Master the art of prompt engineering for effective AI outputs',
        'Showcase your creativity in solving educational challenges',
        'Compete with top talents and gain national recognition',
      ],
    },
    {
      id: 4,
      title: 'Hands-On Workshop',
      description: 'Engage in practical, skill-building sessions led by experts on cutting-edge topics in technology and innovation.',
      date: '12.07.2026',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
      tags: ['Skill Development', 'Practical Learning', 'Interactive', 'Hands-On'],
      time: '10:30 AM - 11:30 PM',
      registerLink: 'https://forms.gle/zLfmJ2QbQdtvbMcE9',
      presentedBy: 'Data Science Lab',
      event: '5th National Data Science Summit 2026',
      hostedBy: 'Data Science Lab and Department of Software Engineering',
      registrationFee: 'TBA',
      prizes: [],
      totalPrizePool: 'N/A',
      eligibility: 'All students welcome',
      teamSize: 'Individual participation',
      perks: ['Event T-shirt', 'Certificate', 'Training Materials'],
      whyJoin: [
        'Learn from industry experts on cutting-edge technology',
        'Gain practical hands-on experience',
        'Build valuable skills for your career',
      ],
    },
    {
      id: 5,
      title: 'Research Poster Presentation',
      description: 'Showcase your innovative ideas on AI, automation, and ethics in an engaging poster presentation, sparking insights and discussions with experts.',
      date: '12.07.2026',
      location: 'Daffodil Smart City, Birulia, Dhaka-1216',
      tags: ['Creative Ideas', 'Poster Session', 'Inspiration', 'Knowledge Sharing'],
      time: '11:30 AM - 12:45 PM',
      registerLink: 'https://forms.gle/gEdAtds8o9jN9bUV9',
      presentedBy: 'Data Science Lab',
      event: '5th National Data Science Summit 2026',
      hostedBy: 'Data Science Lab and Department of Software Engineering',
      registrationFee: '৳800 per participant (up to 2 members)',
      prizes: [
        { place: 'First Prize', amount: '5000/-' },
        { place: 'Second Prize', amount: '3000/-' },
        { place: 'Third Prize', amount: '2000/-' },
      ],
      totalPrizePool: '10,000/-',
      eligibility: 'University, college, and school students (valid student ID required)',
      teamSize: 'Individual or team (up to 2 members)',
      perks: ['Event T-shirt', 'Souvenirs', 'Certificates'],
      whyJoin: [
        'Present your innovative ideas on how AI can transform education',
        'Receive valuable feedback from academic and industry experts',
        'Boost your communication and presentation skills on a national platform',
      ],
    },
  ];

  return (
    <>
      <section
        id="events"
        className="w-full py-24 md:py-32 px-4 relative z-10 bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 md:mb-24">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg blur-xl opacity-30"></div>
                <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white">
                  Events
                </h2>
              </div>
            </div>
            <p className="text-slate-600 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Join us for events that fuel creativity, innovation, and growth. Share your ideas, dive into expert-led sessions, tackle challenges, and showcase your projects.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`group relative rounded-2xl border border-slate-200 dark:border-gray-700/50 bg-white dark:bg-linear-to-br dark:from-slate-800/40 dark:to-slate-900/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 flex flex-col h-full ${idx === 3 || idx === 4 ? 'md:col-span-2 lg:col-span-1 mx-auto' : ''
                  }`}
              >
                {/* linear Background Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Logo Section */}
                <div className="relative px-8 md:px-8 pt-6 pb-4 border-b border-slate-200 dark:border-gray-700/30">
                  <Image
                    src="/dss-logo.svg"
                    alt="DSS Logo"
                    width={120}
                    height={50}
                    className="h-8 md:h-10 object-contain"
                  />
                </div>

                {/* Content */}
                <div className="relative p-8 md:p-8 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-2xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6 grow">
                    {event.description}
                  </p>

                  {/* Info Details */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-xs md:text-sm">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 011-1h6a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V6a2 2 0 012-2h4V2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-xs md:text-sm">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-xs md:text-sm">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full border border-cyan-500/30 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Buttons - Pushed to Bottom */}
                  <div className="flex gap-3 mt-auto pt-6 border-t border-slate-200 dark:border-gray-700/30">
                    <a
                      href={event.registerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 text-xs md:text-sm shadow-lg shadow-cyan-500/20 text-center"
                    >
                      Register Now
                    </a>
                    {event.id === 4 ? (
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 border border-cyan-500/40 text-cyan-300 px-4 py-2.5 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300 text-xs md:text-sm"
                      >
                        Learn More
                      </button>
                    ) : (
                      <a
                        href={getEventPageUrl(event.id)}
                        className="flex-1 border border-cyan-500/40 text-cyan-300 px-4 py-2.5 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300 text-xs md:text-sm text-center"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal - Only for Hands-On Workshop */}
      {selectedEvent && selectedEvent.id === 4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-linear-to-br dark:from-slate-800 dark:to-slate-900 rounded-lg  border border-slate-200 dark:border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-y-scroll no-scrollbar">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Content */}
            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="mb-8 mt-5 md:mt-0">

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{selectedEvent.title}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEvent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full border border-cyan-500/30 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-gray-700/50">
                <div>
                  <p className="text-cyan-400 font-semibold mb-1 text-sm">Date</p>
                  <p className="text-slate-800 dark:text-gray-100 text-lg">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-cyan-400 font-semibold mb-1 text-sm">Time</p>
                  <p className="text-slate-800 dark:text-gray-100 text-lg">{selectedEvent.time}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-cyan-400 font-semibold mb-1 text-sm">Location</p>
                  <p className="text-slate-800 dark:text-gray-100">{selectedEvent.location}</p>
                </div>
              </div>

              {/* Why Join */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why Join?</h3>
                <ul className="space-y-2">
                  {selectedEvent.whyJoin.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-slate-600 dark:text-gray-300">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Registration & Prize Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-gray-700/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Registration</h3>
                  <p className="text-cyan-300 mb-4">{selectedEvent.registrationFee}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    <span className="font-semibold text-slate-600 dark:text-gray-300">Team Size: </span>
                    {selectedEvent.teamSize}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
                    <span className="font-semibold text-slate-600 dark:text-gray-300">Eligibility: </span>
                    {selectedEvent.eligibility}
                  </p>
                </div>

                {selectedEvent.prizes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">🏆 Prizes</h3>
                    <div className="space-y-2 mb-3">
                      {selectedEvent.prizes.map((prize, idx) => (
                        <p key={idx} className="text-slate-600 dark:text-gray-300">
                          <span className="text-cyan-300 font-semibold">{prize.place}:</span> {prize.amount}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-cyan-400 font-semibold">Total: {selectedEvent.totalPrizePool}</p>
                  </div>
                )}
              </div>

              {/* Perks */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">What You&apos;ll Get</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedEvent.perks.map((perk, idx) => (
                    <div key={idx} className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                      <p className="text-cyan-300 font-medium text-sm">{perk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <a
                  href={selectedEvent.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 text-center"
                >
                  Register Now
                </a>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 border border-cyan-500/40 text-cyan-300 px-6 py-3 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}