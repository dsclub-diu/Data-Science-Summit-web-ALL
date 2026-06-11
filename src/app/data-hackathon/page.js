'use client';

import React from 'react';
import Link from 'next/link';

export default function DataHackathonPage() {
    return (
        <div className="bg-slate-950 text-gray-100 min-h-screen">
            {/* Header Section */}
            <section className="text-center py-28 px-4 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tighter">
                    DATA HACKATHON
                </h1>
                <p className="text-2xl text-gray-400 font-light">
                    5 Stages to Build Winning AI Solutions
                </p>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4">
                {/* Event Promotion Hero Section */}
                <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-700/50 shadow-2xl mb-16">
                    {/* Event Title and Theme */}
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 text-center">
                        5th National Data Science Summit 2026
                    </h2>
                    <p className="text-xl md:text-2xl font-medium text-cyan-400 mb-6 text-center">
                        Hosted by Data Science Lab & Dept. of Software Engineering, DIU
                    </p>
                    <p className="text-xl italic text-gray-300 mb-8 text-center">
                        🚀 Innovate • Collaborate • AI in Entrepreneurship
                    </p>

                    {/* Event Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
                        <div className="p-5 bg-slate-800/60 rounded-xl shadow-lg border-l-4 border-cyan-400">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="font-bold text-2xl text-white mt-1">📅 12 Jul 2026</p>
                        </div>
                        <div className="p-5 bg-slate-800/60 rounded-xl shadow-lg border-l-4 border-cyan-400">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Time</p>
                            <p className="font-bold text-2xl text-white mt-1">🕘 09:00 am - 05:00 pm</p>
                        </div>
                        <div className="p-5 bg-slate-800/60 rounded-xl shadow-lg border-l-4 border-cyan-400">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Venue</p>
                            <p className="font-bold text-2xl text-white mt-1">📍 Daffodil Smart City (DSC)</p>
                        </div>
                    </div>

                    {/* Prize & Registration Section */}
                    <div className="lg:flex lg:justify-between lg:items-stretch space-y-8 lg:space-y-0 lg:space-x-8">
                        {/* Prizes */}
                        <div className="bg-slate-950/60 p-6 rounded-xl flex-1 shadow-inner border border-gray-700/30">
                            <h4 className="text-2xl font-extrabold text-amber-400 mb-4 border-b border-gray-700 pb-3 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Prize Pool (30,000/-)
                            </h4>
                            <ul className="list-none space-y-3 text-gray-300">
                                <li className="flex justify-between items-center text-lg font-semibold">
                                    <span>🥇 1st Place</span>
                                    <span className="font-black text-3xl text-amber-400">15,000/-</span>
                                </li>
                                <li className="flex justify-between items-center text-base">
                                    <span>🥈 2nd Place</span>
                                    <span className="font-black text-2xl text-gray-400">10,000/-</span>
                                </li>
                                <li className="flex justify-between items-center text-sm">
                                    <span>🥉 3rd Place</span>
                                    <span className="font-black text-xl text-gray-500">5,000/-</span>
                                </li>
                            </ul>
                        </div>

                        {/* Registration & Key Info */}
                        <div className="bg-slate-950/60 p-6 rounded-xl flex-1 shadow-inner border border-gray-700/30 flex flex-col justify-between">
                            <div>
                                <h4 className="text-2xl font-extrabold text-cyan-400 mb-4 border-b border-gray-700 pb-3 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Key Information
                                </h4>
                                <p className="text-lg text-gray-300 mb-6">All Participants receive T-shirts, souvenirs & official certificates!</p>
                            </div>
                            <div className="mt-auto">
                                <p className="text-lg text-red-400 mb-3 font-bold">📌 Registration Fee: ৳1,200 per team</p>
                                <Link
                                    href="https://forms.gle/gRrD5czCCHp6pNMj6"
                                    target="_blank"
                                    className="w-full text-center block bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl text-xl uppercase tracking-wider"
                                >
                                    🔗 Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hackathon Definition */}
                <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-l-4 border-cyan-400 mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-cyan-400">What is a Data Hackathon?</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        It&apos;s a high-intensity, time-bound event where data scientists, developers, and analysts collaborate to extract meaningful insights, build predictive models, or prototype innovative data-driven solutions for a given problem statement and dataset. It is a marathon of <em>hacking</em> and development.
                    </p>
                </div>

                {/* 5-Step Process */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">The 5-Step Process</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {/* Step 1 */}
                        <div className="group relative bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-xl border-t-4 border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
                            <div className="text-cyan-400 text-4xl mb-3 flex items-center justify-start md:justify-center font-extrabold">
                                <span className="mr-3 md:mr-0">01</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white md:text-center">Team Formation & Problem Understanding</h3>
                            <p className="text-gray-400 text-sm md:text-center">
                                Assemble a diverse team and rigorously study the challenge, defining the scope, goals, and success metrics.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group relative bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-xl border-t-4 border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
                            <div className="text-cyan-400 text-4xl mb-3 flex items-center justify-start md:justify-center font-extrabold">
                                <span className="mr-3 md:mr-0">02</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white md:text-center">Data Preparation & EDA</h3>
                            <p className="text-gray-400 text-sm md:text-center">
                                Clean, process, and explore the dataset. Handle missing values, correct inconsistencies, and engineer valuable features.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group relative bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-xl border-t-4 border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
                            <div className="text-cyan-400 text-4xl mb-3 flex items-center justify-start md:justify-center font-extrabold">
                                <span className="mr-3 md:mr-0">03</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white md:text-center">Model Building & Training</h3>
                            <p className="text-gray-400 text-sm md:text-center">
                                Select the best-fit ML/AI algorithm, train the initial model, and begin crucial hyperparameter tuning for performance.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="group relative bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-xl border-t-4 border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
                            <div className="text-cyan-400 text-4xl mb-3 flex items-center justify-start md:justify-center font-extrabold">
                                <span className="mr-3 md:mr-0">04</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white md:text-center">Evaluation & Validation</h3>
                            <p className="text-gray-400 text-sm md:text-center">
                                Validate model accuracy using test data and iteration. Refine features, parameters, or algorithms to boost scores.
                            </p>
                        </div>

                        {/* Step 5 */}
                        <div className="group relative bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-xl border-t-4 border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
                            <div className="text-cyan-400 text-4xl mb-3 flex items-center justify-start md:justify-center font-extrabold">
                                <span className="mr-3 md:mr-0">05</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white md:text-center">Submission & Pitch</h3>
                            <p className="text-gray-400 text-sm md:text-center">
                                Submit final predictions to the leaderboard and present the solution, methodology, and key business insights to judges.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Call to Action */}
                <div className="text-center mb-16">
                    <p className="text-2xl bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-black uppercase tracking-widest">
                        Get Ready to Hack the Entrepreneurship with Magic of AI!
                    </p>
                </div>

                {/* Additional Info Section */}
                <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Competition Details</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-bold text-cyan-400 mb-3">Eligibility</h4>
                            <p className="text-gray-300 mb-4">University, college, and school students with valid student ID required</p>

                            <h4 className="text-lg font-bold text-cyan-400 mb-3">Team Size</h4>
                            <p className="text-gray-300 mb-4">Team of 2 members</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-cyan-400 mb-3">What You&apos;ll Get</h4>
                            <ul className="text-gray-300 space-y-2">
                                <li>• Event T-shirt</li>
                                <li>• Souvenirs</li>
                                <li>• Certificates</li>
                                <li>• Networking opportunities</li>
                                <li>• Learning from experts</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}