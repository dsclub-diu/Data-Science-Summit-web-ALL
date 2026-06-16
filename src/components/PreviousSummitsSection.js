'use client';

import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function PreviousSummitsSection() {
    const [expandedSummit, setExpandedSummit] = useState(null);
    const [imageIndices, setImageIndices] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    });

    const summits = [
        {
            id: 1,
            title: '1st Data Summit',
            year: 2020,
            date: '11th December',
            description: 'The inaugural Data Science Summit marked the beginning of our journey, bringing together pioneers in the field.',
            stats: { participants: '50+', speakers: '8', sessions: '4' },
            images: ['p1.webp', 'p2.webp', 'p3.webp']
        },
        {
            id: 2,
            title: '2nd Data Summit',
            year: 2021,
            date: '11th December',
            description: 'Expanded reach with industry leaders and hands-on workshops for practical learning.',
            stats: { participants: '150+', speakers: '15', sessions: '8' },
            images: ['p4.webp', 'p5.webp', 'p6.webp']
        },
        {
            id: 3,
            title: '3rd Data Summit',
            year: 2022,
            date: '11th December',
            description: 'Brought international perspectives with renowned speakers and enhanced networking opportunities.',
            stats: { participants: '300+', speakers: '25', sessions: '12' },
            images: ['p7.webp', 'p8.webp', 'p9.webp']
        },
        {
            id: 4,
            title: '4th Data Summit',
            year: 2023,
            date: '11th December',
            description: 'Successfully transitioned to hybrid model, reaching a global audience with cutting-edge data science topics.',
            stats: { participants: '500+', speakers: '35', sessions: '16' },
            images: ['P10.JPG', 'P11.JPG', 'P12.JPG']
        },
    ];

    const toggleSummit = (id) => {
        setExpandedSummit(expandedSummit === id ? null : id);
    };

    const nextImage = (summitId) => {
        setImageIndices(prev => ({
            ...prev,
            [summitId]: (prev[summitId] + 1) % summits.find(s => s.id === summitId).images.length
        }));
    };

    const prevImage = (summitId) => {
        const summit = summits.find(s => s.id === summitId);
        setImageIndices(prev => ({
            ...prev,
            [summitId]: (prev[summitId] - 1 + summit.images.length) % summit.images.length
        }));
    };

    const ImageGallery = ({ summit }) => {
        const currentIndex = imageIndices[summit.id];
        const imageName = summit.images[currentIndex];

        return (
            <div className="relative w-full h-72 bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-t-xl">
                <Image
                    src={`/${imageName}`}
                    alt={summit.title}
                    fill
                    className="object-cover"
                />

                {summit.images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage(summit.id);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full z-20"
                        >
                            <ChevronLeft size={20} className="text-white" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage(summit.id);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full z-20"
                        >
                            <ChevronRight size={20} className="text-white" />
                        </button>

                        <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
                            {currentIndex + 1}/{summit.images.length}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <section id="previous-summits" className="w-full py-24 md:py-32 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-block mb-6">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
                            <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white">
                                Previous Summits
                            </h2>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-lg mt-6">Journey through our past Data Science Summits</p>
                </div>

                {/* Desktop */}
                <div className="hidden md:block relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-linear-to-b from-cyan-500/50 via-blue-500/50 to-purple-500/50"></div>

                    <div className="space-y-20">
                        {summits.map((summit, idx) => (
                            <div key={summit.id} className="flex items-center w-full">

                                {/* LEFT */}
                                <div className="w-1/2 pr-12">
                                    {idx % 2 !== 0 && (
                                        <div className="group relative rounded-xl border border-cyan-500/30 bg-white dark:bg-linear-to-br dark:from-slate-800/40 dark:to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-cyan-500/60 hover:shadow-cyan-500/20 shadow-lg">

                                            <ImageGallery summit={summit} />

                                            <div className="p-6 relative text-right">
                                                <h3 className="text-2xl text-slate-900 dark:text-white font-bold mb-2">{summit.title}</h3>
                                                <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-3">{summit.date}, {summit.year}</p>
                                                <p className="text-slate-600 dark:text-gray-300 text-sm mb-6">{summit.description}</p>

                                                <div className="flex gap-6 justify-end">
                                                    <div>
                                                        <p className="text-2xl text-cyan-600 dark:text-cyan-400 font-bold">{summit.stats.participants}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Participants</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl text-purple-600 dark:text-purple-400 font-bold">{summit.stats.speakers}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Speakers</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl text-blue-600 dark:text-blue-400 font-bold">{summit.stats.sessions}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Sessions</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* DOT */}
                                <div className="w-auto flex justify-center">
                                    <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-lg ring-4 ring-white dark:ring-slate-950"></div>
                                </div>

                                {/* RIGHT */}
                                <div className="w-1/2 pl-12">
                                    {idx % 2 === 0 && (
                                        <div className="group relative rounded-xl border border-cyan-500/30 bg-white dark:bg-linear-to-br dark:from-slate-800/40 dark:to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-cyan-500/60 hover:shadow-cyan-500/20 shadow-lg">

                                            <ImageGallery summit={summit} />

                                            <div className="p-6 relative">
                                                <h3 className="text-2xl text-slate-900 dark:text-white font-bold mb-2">{summit.title}</h3>
                                                <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-3">{summit.date}, {summit.year}</p>
                                                <p className="text-slate-600 dark:text-gray-300 text-sm mb-6">{summit.description}</p>

                                                <div className="flex gap-6">
                                                    <div>
                                                        <p className="text-2xl text-cyan-600 dark:text-cyan-400 font-bold">{summit.stats.participants}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Participants</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl text-purple-600 dark:text-purple-400 font-bold">{summit.stats.speakers}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Speakers</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl text-blue-600 dark:text-blue-400 font-bold">{summit.stats.sessions}</p>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">Sessions</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Mobile (NO nested buttons anymore) */}
                <div className="md:hidden space-y-4">
                    {summits.map((summit) => (
                        <div key={summit.id}>
                            <div
                                className="w-full group relative rounded-xl border border-cyan-500/30 bg-white dark:bg-linear-to-br dark:from-slate-800/40 dark:to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-cyan-500/60 hover:shadow-cyan-500/20 transition-all"
                            >
                                {/* CLICKABLE HEADER */}
                                <div onClick={() => toggleSummit(summit.id)} className="cursor-pointer">
                                    <ImageGallery summit={summit} />

                                    <div className="relative p-4 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{summit.title}</h3>
                                            <p className="text-sm text-cyan-600 dark:text-cyan-400">{summit.date}, {summit.year}</p>
                                        </div>
                                        <ChevronDown
                                            size={24}
                                            className={`text-cyan-400 transition-transform duration-300 ${expandedSummit === summit.id ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* EXPANDED CONTENT */}
                            {expandedSummit === summit.id && (
                                <div className="mt-2 rounded-xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-linear-to-br dark:from-slate-800/30 dark:to-slate-900/30 p-5">
                                    <p className="text-slate-600 dark:text-gray-300 text-sm mb-6">{summit.description}</p>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{summit.stats.participants}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">Participants</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{summit.stats.speakers}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">Speakers</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{summit.stats.sessions}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">Sessions</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
