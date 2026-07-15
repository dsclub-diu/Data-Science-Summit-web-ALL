'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const [isResultsOpen, setIsResultsOpen] = useState(false);
     const [scrolled, setScrolled] = useState(false);

     // Scroll listener
     useEffect(() => {
          const handleScroll = () => {
               if (window.scrollY > 20) {
                    setScrolled(true);
               } else {
                    setScrolled(false);
               }
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
     }, []);

     const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
     const closeMenu = () => setIsMenuOpen(false);
     const openResults = () => setIsResultsOpen(true);
     const closeResults = () => setIsResultsOpen(false);

     const navLinks = [
          { label: 'Events', href: '#events' },
          { label: 'Schedule', href: '#schedule' },
          { label: 'Previous Summits', href: '#previous-summits' },
          { label: 'My Seat', href: '/my-seat' },
          { label: 'Results', href: '#results', action: openResults },
          // { label: 'About', href: '#about' },
     ];

     const handleSmoothScroll = (e, link) => {
          // Real routes navigate normally; only hash links smooth-scroll
          if (link.href.startsWith('/')) {
               closeMenu();
               return;
          }
          e.preventDefault();
          if (link.action) {
               link.action();
          } else {
               const element = document.querySelector(link.href);
               if (element) element.scrollIntoView({ behavior: 'smooth' });
               closeMenu();
          }
     };

     return (
          <nav
               className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 transition-colors duration-300 ${
                    scrolled
                         ? 'bg-white/90 dark:bg-black/95 border-b border-slate-200/70 dark:border-white/10 backdrop-blur-md'
                         : 'bg-white/40 dark:bg-black/35 backdrop-blur-sm'
               }`}
          >
               <div className="flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="shrink-0">
                         <Link href="/">
                              <div className="w-32 md:w-40 h-auto">
                                   <Image 
                                        src='/logo.png' 
                                        alt='Logo' 
                                        width={150} 
                                        height={100}
                                        priority
                                   />
                              </div>
                         </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
                         <ul className="flex list-none gap-8 m-0 p-0">
                              {navLinks.map((link) => (
                                   <li key={link.label}>
                                        <a
                                             href={link.href}
                                             onClick={(e) => handleSmoothScroll(e, link)}
                                             className="text-slate-700 dark:text-gray-100 text-base font-medium hover:text-cyan-500 dark:hover:text-cyan-400 hover:pb-1 transition-all duration-300 relative group cursor-pointer"
                                        >
                                             {link.label}
                                             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                                        </a>
                                   </li>
                              ))}
                         </ul>
                    </div>

                    {/* Desktop Register + Theme toggle */}
                    <div className="hidden md:flex ml-auto items-center gap-3">
                         <ThemeToggle />
                         <Link href="#events">
                         <button className="bg-linear-to-r from-cyan-500 to-blue-900 text-white px-8 py-3 font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-800 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                              Register Now
                         </button>
                         </Link>
                    </div>

                    {/* Mobile: theme toggle + hamburger */}
                    <div className="md:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <div
                         className="flex flex-col gap-1.5 cursor-pointer"
                         onClick={toggleMenu}
                    >
                         <span className={`w-6 h-0.5 bg-slate-800 dark:bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2 origin-center' : ''}`}></span>
                         <span className={`w-6 h-0.5 bg-slate-800 dark:bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                         <span className={`w-6 h-0.5 bg-slate-800 dark:bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2 origin-center' : ''}`}></span>
                    </div>
                    </div>
               </div>

               {/* Mobile Menu */}
               {isMenuOpen && (
                    <>
                         <div 
                              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
                              onClick={closeMenu}
                         ></div>
                         <div
                              className="fixed top-20 left-4 right-4 bg-white dark:bg-linear-to-b dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 rounded-2xl shadow-2xl z-50 border border-slate-200 dark:border-cyan-500/20 overflow-hidden"
                         >
                              <div className="p-6">
                                   <ul className="flex flex-col list-none gap-1 m-0 p-0">
                                        {navLinks.map((link) => (
                                             <li key={link.label}>
                                                  <a
                                                       href={link.href}
                                                       onClick={(e) => handleSmoothScroll(e, link)}
                                                       className="text-slate-700 dark:text-gray-100 text-base font-medium hover:text-cyan-600 dark:hover:text-cyan-300 transition-all duration-300 px-4 py-3 block rounded-lg hover:bg-cyan-500/10 border-l-2 border-transparent hover:border-cyan-400"
                                                  >
                                                       {link.label}
                                                  </a>
                                             </li>
                                        ))}
                                   </ul>
                                   <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                                        <Link href="#events">
                                        <button
                                             className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                                             onClick={closeMenu}
                                        >
                                             Register Now
                                        </button>
                                        </Link>
                                   </div>
                              </div>
                         </div>
                    </>
               )}

               {/* Results Modal */}
               {isResultsOpen && (
                    <>
                         <div
                              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                              onClick={closeResults}
                         ></div>
                         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/3 bg-white dark:bg-linear-to-br dark:from-slate-800 dark:to-blue-900 rounded-2xl shadow-2xl z-60 border border-slate-200 dark:border-cyan-500 p-6">
                              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">Results</h2>
                              <p className="text-slate-600 dark:text-gray-200 mb-6 text-center">
                                   The results are not published yet. Please check back later.
                              </p>
                              <div className="flex justify-center">
                                   <button
                                        onClick={closeResults}
                                        className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                   >
                                        Close
                                   </button>
                              </div>
                         </div>
                    </>
               )}
          </nav>
     );
}
