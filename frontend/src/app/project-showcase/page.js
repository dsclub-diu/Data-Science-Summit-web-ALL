'use client';

import React from 'react';
import Link from 'next/link';

export default function ProjectShowcasePage() {
    return (
        <div className="bg-slate-950 text-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-18">
                {/* Header Section */}
                <header className="text-center mb-16 pt-4">
                    <h1 className="text-6xl font-extrabold bg-linear-to-r from-cyan-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent mb-4 sm:text-7xl lg:text-8xl animate-pulse">
                        AI & Data Science Innovation Showcase
                    </h1>
                    <p className="text-2xl text-gray-300 font-light tracking-wide">Fueling Entrepreneurship & the Future of Learning</p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Competition 1: AI in Entrepreneurship Project Showcase (2/3 width on desktop) */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl border border-cyan-700/50 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-500/20">
                            <div className="flex items-center mb-8">
                                {/* Trophy Icon */}
                                <svg className="w-12 h-12 text-cyan-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <h2 className="text-3xl font-bold text-cyan-300">Project Showcase: AI in Entrepreneurship</h2>
                            </div>
                            <p className="text-gray-300 mb-8 text-lg leading-relaxed">Design, develop, and present a commercially viable, AI-powered solution addressing a challenge in the entrepreneurial space.</p>

                            {/* Core Focus Grid */}
                            <h3 className="text-2xl font-semibold mb-6 text-cyan-400 border-b border-gray-700 pb-3">💡 Core Focus Areas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition duration-300 border border-gray-700/30 group">
                                    <span className="font-extrabold text-emerald-300 block mb-1 group-hover:text-emerald-200 transition-colors">Analytics & BI</span>
                                    <span className="text-gray-400">Market trend analysis & predictive modeling.</span>
                                </div>
                                <div className="p-5 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition duration-300 border border-gray-700/30 group">
                                    <span className="font-extrabold text-emerald-300 block mb-1 group-hover:text-emerald-200 transition-colors">Automated Services</span>
                                    <span className="text-gray-400">Smart chatbots, content generation, process automation.</span>
                                </div>
                                <div className="p-5 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition duration-300 border border-gray-700/30 group">
                                    <span className="font-extrabold text-emerald-300 block mb-1 group-hover:text-emerald-200 transition-colors">Risk & Decisions</span>
                                    <span className="text-gray-400">Startup success prediction, investment risk assessment.</span>
                                </div>
                                <div className="p-5 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition duration-300 border border-gray-700/30 group">
                                    <span className="font-extrabold text-emerald-300 block mb-1 group-hover:text-emerald-200 transition-colors">Product Innovation</span>
                                    <span className="text-gray-400">AI as the central component (e.g., LLM apps, recommendation engines).</span>
                                </div>
                            </div>
                        </div>

                        {/* Technical Development Steps (Timeline Style) */}
                        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl border border-emerald-700/50 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-emerald-500/20">
                            <h3 className="text-3xl font-bold mb-8 text-emerald-300">🛠️ The 4-Step Project Execution</h3>

                            <div className="space-y-8 relative pl-12">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-600 rounded-full"></div>

                                {/* Step 1 */}
                                <div className="relative z-10">
                                    <div className="absolute -left-10 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-950 shrink-0">1</div>
                                    <h4 className="font-bold text-xl text-emerald-300 mb-2">Define the Problem & Business Value</h4>
                                    <p className="text-gray-400 leading-relaxed">Identify a specific problem, propose an AI solution, and define its commercial value (saving cost, generating revenue, improving efficiency).</p>
                                </div>

                                {/* Step 2 */}
                                <div className="relative z-10">
                                    <div className="absolute -left-10 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-950 shrink-0">2</div>
                                    <h4 className="font-bold text-xl text-emerald-300 mb-2">Technical Development & Modeling</h4>
                                    <p className="text-gray-400 leading-relaxed">Acquire/Prepare Data, develop appropriate ML/DL/NLP models, and rigorously test performance using standard metrics (F1, Accuracy, etc.).</p>
                                </div>

                                {/* Step 3 */}
                                <div className="relative z-10">
                                    <div className="absolute -left-10 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-950 shrink-0">3</div>
                                    <h4 className="font-bold text-xl text-emerald-300 mb-2">Entrepreneurial Context & MVP</h4>
                                    <p className="text-gray-400 leading-relaxed">Create a functional <strong>Minimum Viable Product (MVP)</strong> proof-of-concept (e.g., web app) and develop a full <strong>Business Case</strong> (market size, revenue model).</p>
                                </div>

                                {/* Step 4 */}
                                <div className="relative z-10">
                                    <div className="absolute -left-10 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-950 shrink-0">4</div>
                                    <h4 className="font-bold text-xl text-emerald-300 mb-2">The Showcase Presentation & Q&A</h4>
                                    <p className="text-gray-400 leading-relaxed">Present findings and a live demo to judges. Focus on <strong>Clarity of Communication</strong> for non-technical audiences and defending innovation/business strategy.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Competition 2: Data Science Summit Poster Presentation (1/3 width on desktop) */}
                    <div className="lg:col-span-1 space-y-12">
                        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl border border-purple-700/50 shadow-2xl sticky top-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-purple-500/20">
                            <div className="flex items-center mb-8">
                                {/* Icon: Poster/Idea */}
                                <svg className="w-12 h-12 text-purple-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h2 className="text-3xl font-bold text-purple-300">Project Showcase</h2>
                            </div>

                            <p className="text-gray-300 mb-8 text-lg">Unleash innovative solutions in <em>AI-driven entrepreneurship</em> at Bangladesh’s largest data science event!</p>

                            <div class="space-y-4 mb-10 text-base border-l-4 border-purple-500 pl-4">
                                <p className="text-gray-300">
                                    <span className="font-bold mr-2 text-purple-400">Summit:</span> 5th National Data Science Summit 2026
                                </p>
                                <p className="text-gray-300">
                                    <span className="font-bold mr-2 text-purple-400">Organized by:</span> Data Science Lab & Dept. of Software Engineering, DIU
                                </p>
                                <p className="text-gray-300">
                                    <span className="font-bold mr-2 text-purple-400">Location:</span> Daffodil Smart City, Dhaka
                                </p>
                                <p className="text-gray-300">
                                    <span className="font-bold mr-2 text-purple-400">Eligibility:</span> School, College & University Students (Team of 2 members)
                                </p>
                            </div>

                            {/* Awards Section */}
                            <h3 className="text-2xl font-semibold mb-5 text-purple-400 border-b border-gray-700 pb-3">💰 Awards & Perks</h3>
                            <div className="space-y-3 mb-10">
                                <div className="flex justify-between items-center p-3 bg-linear-to-r from-purple-900/50 to-purple-900/10 rounded-xl border border-purple-800">
                                    <span className="font-extrabold text-xl text-yellow-300">🏆 Champion</span>
                                    <span className="font-bold text-yellow-300 text-2xl">7,000 BDT</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-xl">
                                    <span className="text-purple-300 font-semibold">1st Runner-up</span>
                                    <span className="text-gray-300">5,000 BDT</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-xl">
                                    <span className="text-purple-300 font-semibold">2nd Runner-up</span>
                                    <span className="text-gray-300">3,000 BDT</span>
                                </div>
                                <p className="text-base text-gray-400 pt-3 text-center">✨ All Participants receive T-shirt, souvenirs & certificates.</p>
                            </div>

                            {/* Registration & Deadline */}
                            <h3 className="text-2xl font-semibold mb-5 text-purple-400 border-b border-gray-700 pb-3">🗓️ Deadline & Registration</h3>
                            <p className="text-xl font-extrabold text-red-400 mb-6 text-center tracking-wider">Deadline: Jun 25, 2026</p>
                            <p className="text-xl font-extrabold text-red-400 mb-6 text-center tracking-wider"> Fee: 1,000 BDT per team.</p>
                            <Link
                                href="https://forms.gle/Q16BjVQDSzij6Tc47"
                                target="_blank"
                                className="block w-full text-center py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition duration-300 font-extrabold text-white text-lg uppercase tracking-widest shadow-2xl hover:shadow-purple-500/20"
                            >
                                Register Now
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}