'use client';

import { useState } from 'react';
import { Search, MapPin, Clock, Users, Crown, Info, Laptop } from 'lucide-react';

const SALT = 'ndss2026';

const EVENT_META = {
     'promptcraft': {
          title: 'Prompt Craft Challenge',
          time: '12:30 PM – 1:30 PM',
          venue: 'Computer Labs (710, 711A, 711B, 814A), Knowledge Tower',
          accent: 'text-blue-500 dark:text-blue-400',
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30',
     },
     'data-hackathon': {
          title: 'Data Hackathon',
          time: '11:00 AM – 2:30 PM',
          venue: 'Labs 601 (DS), 614 (CS), 814B, 609 & Robotics Lab (613), Knowledge Tower',
          accent: 'text-teal-500 dark:text-teal-400',
          badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/30',
     },
     'project-showcase': {
          title: 'Project Showcase',
          time: '11:00 AM – 2:00 PM',
          venue: 'Student Lounge (table side), Knowledge Tower',
          accent: 'text-amber-500 dark:text-amber-400',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30',
     },
     'research-poster': {
          title: 'Research Poster Presentation',
          time: '11:00 AM – 1:00 PM',
          venue: 'Student Lounge (board side), Knowledge Tower',
          accent: 'text-violet-500 dark:text-violet-400',
          badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/30',
     },
     'hands-on-workshop': {
          title: 'Hands-On Workshop — Sumit Saha',
          time: '11:30 AM – 12:30 PM',
          venue: 'Prof. Dr. Aminul Islam Seminar Hall, Level 6',
          accent: 'text-rose-500 dark:text-rose-400',
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30',
          openSeating: true,
     },
};

async function sha256(value) {
     const data = new TextEncoder().encode(`${SALT}:${value}`);
     const digest = await crypto.subtle.digest('SHA-256', data);
     return Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
}

function normalizeInput(raw) {
     const trimmed = raw.trim();
     if (trimmed.includes('@')) return trimmed.toLowerCase();
     return trimmed.replace(/\s+/g, '').toLowerCase();
}

export default function MySeatPage() {
     const [query, setQuery] = useState('');
     const [results, setResults] = useState(null); // null = not searched yet
     const [teams, setTeams] = useState({});
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     const handleSearch = async (e) => {
          e.preventDefault();
          const normalized = normalizeInput(query);
          if (!normalized) return;
          setLoading(true);
          setError('');
          try {
               const res = await fetch('/seatmap.json');
               if (!res.ok) throw new Error('Seat data unavailable');
               const data = await res.json();
               const hash = await sha256(normalized);
               const matches = data.entries.filter(
                    (entry) => entry.idh === hash || entry.emh === hash
               );
               setTeams(data.teams || {});
               setResults(matches);
          } catch (err) {
               setError('Could not load seat data. Please try again, or ask at the registration desk.');
               setResults(null);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen pt-28 pb-16 px-4">
               <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <header className="text-center mb-10">
                         <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                              Find Your Seat
                         </h1>
                         <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                              Enter the <strong>student ID</strong> or <strong>email address</strong> you registered with
                              to see your venue, room, and seat for Sunday, 12 July 2026.
                         </p>
                    </header>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="step-card rounded-xl p-4 md:p-6 mb-8">
                         <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                   type="text"
                                   value={query}
                                   onChange={(e) => setQuery(e.target.value)}
                                   placeholder="e.g. 251-35-157 or you@example.com"
                                   autoComplete="off"
                                   className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                   aria-label="Student ID or email address"
                              />
                              <button
                                   type="submit"
                                   disabled={loading || !query.trim()}
                                   className="px-6 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                   <Search size={18} />
                                   {loading ? 'Searching…' : 'Find my seat'}
                              </button>
                         </div>
                    </form>

                    {/* Error */}
                    {error && (
                         <div className="step-card rounded-xl p-5 mb-6 border-red-500/40 text-red-500 dark:text-red-400 text-center">
                              {error}
                         </div>
                    )}

                    {/* No match */}
                    {results !== null && results.length === 0 && !error && (
                         <div className="step-card rounded-xl p-6 text-center">
                              <p className="text-slate-800 dark:text-slate-200 font-semibold mb-2">
                                   No registration found for “{query.trim()}”
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">
                                   Make sure you typed the exact student ID or email used during registration.
                                   Still stuck? Visit the registration desk at the Student Lounge (from 8:00 AM).
                              </p>
                         </div>
                    )}

                    {/* Results */}
                    {results !== null && results.length > 0 && (
                         <div className="space-y-6">
                              <p className="text-center text-slate-600 dark:text-slate-300">
                                   Welcome, <strong className="text-slate-900 dark:text-white">{results[0].name}</strong>
                                   {' '}— you have {results.length} registration{results.length > 1 ? 's' : ''}.
                              </p>
                              {results.map((entry, i) => (
                                   <EventCard key={i} entry={entry} team={entry.teamId ? teams[entry.teamId] : null} />
                              ))}
                         </div>
                    )}

                    {/* Footer note */}
                    <p className="mt-12 text-center text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-1.5">
                         <Info size={14} />
                         Seat assignments may be updated before the event — check again on summit morning.
                    </p>
               </div>
          </div>
     );
}

function EventCard({ entry, team }) {
     const meta = EVENT_META[entry.event] || { title: entry.event, badge: '', accent: '' };
     const isLeader = entry.role === 'leader' && team;
     const hasSeat = Boolean(entry.code || entry.room);

     return (
          <div className="step-card rounded-xl p-6 md:p-8">
               {/* Event title */}
               <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h2 className={`text-xl md:text-2xl font-bold ${meta.accent}`}>{meta.title}</h2>
                    {entry.team && (
                         <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${meta.badge}`}>
                              Team: {entry.team}
                         </span>
                    )}
                    {entry.role === 'leader' && entry.team && (
                         <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 border-yellow-500/30 flex items-center gap-1">
                              <Crown size={12} /> Team Lead
                         </span>
                    )}
               </div>

               {/* Time + venue */}
               <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                    <p className="flex items-center gap-2">
                         <Clock size={15} className="shrink-0 opacity-70" /> {meta.time}
                    </p>
                    <p className="flex items-center gap-2">
                         <MapPin size={15} className="shrink-0 opacity-70" /> {meta.venue}
                    </p>
               </div>

               {/* Seat allocation */}
               {meta.openSeating ? (
                    <div className="rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 p-5 text-center">
                         <p className="text-slate-800 dark:text-slate-100 font-semibold">Open seating</p>
                         <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                              No assigned seat — arrive 10 minutes early for a good spot.
                         </p>
                    </div>
               ) : hasSeat ? (
                    <div className="grid grid-cols-3 gap-3 text-center">
                         <SeatStat label="Room" value={entry.room} />
                         <SeatStat label="Seat" value={entry.seat} />
                         <SeatStat label="Seat Code" value={entry.code} mono />
                    </div>
               ) : (
                    <div className="rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-slate-600 p-5 text-center">
                         <p className="text-slate-800 dark:text-slate-100 font-semibold">
                              Seat assignment coming soon
                         </p>
                         <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                              {entry.ownDevice
                                   ? 'Your team registered with its own laptop — you will be seated in the Robotics Lab. Exact table publishing soon.'
                                   : 'Check back here before the event — your room and seat will appear on this page.'}
                         </p>
                    </div>
               )}

               {/* Own-device note when already seated */}
               {hasSeat && entry.ownDevice && (
                    <p className="mt-4 text-sm text-teal-600 dark:text-teal-300 flex items-center gap-2">
                         <Laptop size={15} /> Own-laptop team — remember to bring your charger and power strip if you have one.
                    </p>
               )}

               {/* Team lead panel */}
               {isLeader && (
                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
                         <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                              <Users size={15} /> Your team roster ({team.members.length} member{team.members.length > 1 ? 's' : ''})
                         </h3>
                         <ul className="space-y-2">
                              {team.members.map((member, i) => (
                                   <li
                                        key={i}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 px-4 py-2.5"
                                   >
                                        <span className="text-slate-800 dark:text-slate-100 text-sm font-medium flex items-center gap-2">
                                             {member.role === 'leader' && <Crown size={13} className="text-yellow-500" />}
                                             {member.name}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{member.sid}</span>
                                   </li>
                              ))}
                         </ul>
                         <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                              As team lead, make sure every member checks in at registration (8:00 – 9:30 AM) and knows your station.
                         </p>
                    </div>
               )}
          </div>
     );
}

function SeatStat({ label, value, mono }) {
     return (
          <div className="rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 py-4 px-2">
               <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{label}</p>
               <p className={`text-lg md:text-xl font-bold text-slate-900 dark:text-white ${mono ? 'font-mono' : ''}`}>
                    {value || '—'}
               </p>
          </div>
     );
}
