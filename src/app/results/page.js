"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Medal, Award, Star, Crown, Users, Calendar } from "lucide-react";

// Mock leaderboard data - replace with real data from your API
const leaderboardData = [
    // Data Hackathon Category
    {
        rank: 1,
        globalRank: 1,
        team: "DataViz Masters",
        members: ["Alice Johnson", "Bob Smith", "Carol Brown"],
        score: 95.8,
        project: "AI-Powered Climate Prediction Model",
        category: "Data Hackathon",
        avatar: "/public/1.png"
    },
    {
        rank: 2,
        globalRank: 2,
        team: "Neural Networks Inc.",
        members: ["David Wilson", "Eva Garcia", "Frank Lee"],
        score: 92.4,
        project: "Smart Healthcare Analytics Platform",
        category: "Data Hackathon",
        avatar: "/public/2.png"
    },
    {
        rank: 3,
        globalRank: 3,
        team: "ML Innovators",
        members: ["Grace Chen", "Henry Davis", "Ivy Martinez"],
        score: 89.7,
        project: "Predictive Supply Chain Optimization",
        category: "Data Hackathon",
        avatar: "/public/3.png"
    },
    {
        rank: 4,
        globalRank: 4,
        team: "Data Scientists Pro",
        members: ["John Doe", "Jane Smith", "Mike Johnson"],
        score: 87.5,
        project: "Advanced Forecasting System",
        category: "Data Hackathon",
        avatar: "/public/4.png"
    },

    // Project Showcase Category
    {
        rank: 1,
        globalRank: 5,
        team: "AI Pioneers",
        members: ["Mia Rodriguez", "Noah White", "Olivia Harris"],
        score: 94.2,
        project: "Automated Document Processing System",
        category: "Project Showcase",
        avatar: "/public/5.png"
    },
    {
        rank: 2,
        globalRank: 6,
        team: "Tech Innovators",
        members: ["Sarah Connor", "Kyle Reese", "John Connor"],
        score: 91.8,
        project: "Smart City Management Platform",
        category: "Project Showcase",
        avatar: "/public/6.png"
    },
    {
        rank: 3,
        globalRank: 7,
        team: "Data Crusaders",
        members: ["Jack Taylor", "Kate Anderson", "Liam Thompson"],
        score: 89.3,
        project: "Social Media Sentiment Analysis Tool",
        category: "Project Showcase",
        avatar: "/public/7.png"
    },
    {
        rank: 4,
        globalRank: 8,
        team: "Future Builders",
        members: ["Alex Chen", "Maria Garcia", "Tom Wilson"],
        score: 86.7,
        project: "E-commerce Recommendation Engine",
        category: "Project Showcase",
        avatar: "/public/8.png"
    },

    // Research Poster Category
    {
        rank: 1,
        globalRank: 9,
        team: "Research Leaders",
        members: ["Dr. Smith", "Prof. Johnson", "Ms. Brown"],
        score: 93.5,
        project: "Quantum Computing Applications in ML",
        category: "Research Poster",
        avatar: "/public/9.png"
    },
    {
        rank: 2,
        globalRank: 10,
        team: "Future Coders",
        members: ["Peter Clark", "Quinn Lewis", "Ruby Walker"],
        score: 90.1,
        project: "Real-time Traffic Optimization",
        category: "Research Poster",
        avatar: "/public/10.png"
    },
    {
        rank: 3,
        globalRank: 11,
        team: "Tech Wizards",
        members: ["Sam Hall", "Tina Allen", "Uma Young"],
        score: 87.9,
        project: "Blockchain-based Data Security",
        category: "Research Poster",
        avatar: "/public/11.png"
    },

    // PromptCraft Category
    {
        rank: 1,
        globalRank: 12,
        team: "Prompt Masters",
        members: ["AI Expert", "Prompt Engineer", "Creative Writer"],
        score: 96.5,
        project: "Advanced Prompt Engineering Framework",
        category: "PromptCraft",
        avatar: "/public/12.png"
    },
    {
        rank: 2,
        globalRank: 13,
        team: "Creative Coders",
        members: ["Lisa Park", "James Bond", "Emma Stone"],
        score: 94.8,
        project: "Multi-modal Prompt Generation",
        category: "PromptCraft",
        avatar: "/public/13.png"
    },
    {
        rank: 3,
        globalRank: 14,
        team: "Code Warriors",
        members: ["Victor King", "Wendy Scott", "Xavier Green"],
        score: 92.1,
        project: "Voice Recognition System",
        category: "PromptCraft",
        avatar: "/public/1.png"
    }
];

const categoryColors = {
    "Data Hackathon": "bg-linear-to-r from-cyan-500 to-blue-600",
    "Project Showcase": "bg-linear-to-r from-blue-500 to-cyan-500",
    "Research Poster": "bg-linear-to-r from-slate-500 to-gray-600",
    "PromptCraft": "bg-linear-to-r from-cyan-400 to-blue-500"
};

const getRankIcon = (rank) => {
    switch (rank) {
        case 1:
            return <Crown className="w-8 h-8 text-cyan-400" />;
        case 2:
            return <Trophy className="w-7 h-7 text-slate-300" />;
        case 3:
            return <Medal className="w-6 h-6 text-blue-400" />;
        default:
            return <Award className="w-5 h-5 text-gray-400" />;
    }
};

const PodiumCard = ({ team, position, isVisible }) => {
    const { categoryRank, team: teamName, members, score, project, category } = team;
    const rank = categoryRank || team.rank; // Use categoryRank if available, fallback to rank

    const heights = {
        1: 'h-32', // Winner - tallest
        2: 'h-24', // Second - medium
        3: 'h-20'  // Third - shortest
    };

    const orders = {
        1: 'order-2', // Winner in center
        2: 'order-1', // Second on left
        3: 'order-3'  // Third on right
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: rank * 0.3,
                type: "spring",
                bounce: 0.4
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className={`${orders[rank]} flex flex-col items-center`}
        >
            {/* Podium Base */}
            <motion.div
                className={`${heights[rank]} w-24 md:w-32 ${rank === 1 ? 'bg-linear-to-t from-cyan-600 to-cyan-400' :
                    rank === 2 ? 'bg-linear-to-t from-slate-600 to-slate-400' :
                        'bg-linear-to-t from-blue-600 to-blue-400'
                    } rounded-t-lg relative flex items-end justify-center pb-2`}
                whileHover={{ scale: 1.05 }}
            >
                <span className="text-white font-bold text-xl md:text-2xl">{rank}</span>

                {/* Podium glow effect */}
                <div className={`absolute inset-0 rounded-t-lg ${rank === 1 ? 'bg-cyan-400/20' :
                    rank === 2 ? 'bg-slate-400/20' :
                        'bg-blue-400/20'
                    } animate-pulse`}></div>
            </motion.div>

            {/* Team Card */}
            <motion.div
                className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30 mt-2 w-48 md:w-56 relative"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(34, 211, 238, 0.3)" }}
            >
                {/* Rank Badge */}
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center ${rank === 1 ? 'bg-linear-to-r from-cyan-400 to-blue-600' :
                    rank === 2 ? 'bg-linear-to-r from-slate-400 to-slate-600' :
                        'bg-linear-to-r from-blue-500 to-cyan-500'
                    }`}>
                    {getRankIcon(rank)}
                </div>

                <h3 className="text-white font-bold text-sm md:text-base mb-2">{teamName}</h3>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-2">
                    {score}
                </div>
                <p className="text-gray-300 text-xs mb-2">{project}</p>
                <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${categoryColors[category]}`}>
                    {category}
                </span>
            </motion.div>
        </motion.div>
    );
};

const LeaderboardCard = ({ team, index, isVisible }) => {
    const { categoryRank, team: teamName, members, score, project, category } = team;
    const rank = categoryRank || team.rank; // Use categoryRank if available, fallback to rank

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }
        }
    };

    const isTopThree = rank <= 3;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
            }}
            className={`relative p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-cyan-500/20 ${isTopThree
                ? 'bg-linear-to-br from-slate-800/95 to-slate-900/90'
                : 'bg-slate-800/80'
                } ${isTopThree ? 'ring-2 ring-cyan-400/50' : ''}`}
        >
            {/* Rank Badge */}
            <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${rank === 1 ? 'bg-linear-to-r from-cyan-400 to-blue-600' :
                rank === 2 ? 'bg-linear-to-r from-slate-400 to-slate-600' :
                    rank === 3 ? 'bg-linear-to-r from-blue-500 to-cyan-500' :
                        'bg-linear-to-r from-gray-600 to-slate-700'
                }`}>
                {rank <= 3 ? getRankIcon(rank) : rank}
            </div>

            {/* Team Info */}
            <div className="ml-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{teamName}</h3>
                    <motion.div
                        className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500"
                        whileHover={{ scale: 1.1 }}
                    >
                        {score}
                    </motion.div>
                </div>

                {/* Members */}
                <div className="flex items-center mb-3">
                    <Users className="w-4 h-4 text-cyan-400 mr-2" />
                    <p className="text-sm text-gray-300">
                        {members.join(", ")}
                    </p>
                </div>

                {/* Project */}
                <p className="text-gray-200 mb-3 font-medium">{project}</p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${categoryColors[category]}`}>
                        {category}
                    </span>
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-cyan-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-300">Score</span>
                    </div>
                </div>
            </div>

            {/* Celebration Animation for Top 3 */}
            {isTopThree && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                            "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
        </motion.div>
    );
};

export default function LeaderboardPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Data Hackathon"); // Start with first category
    const [revealedCards, setRevealedCards] = useState(new Set());
    const [showPodium, setShowPodium] = useState(false);
    const [currentRevealIndex, setCurrentRevealIndex] = useState(3); // Start after top 3
    const [showCountdown, setShowCountdown] = useState(true);
    const [countdown, setCountdown] = useState(3);

    const categories = Object.keys(categoryColors);

    // Get category-specific rankings (each category has its own 1st, 2nd, 3rd place)
    const getCategoryData = (category) => {
        const categoryTeams = leaderboardData.filter(team => team.category === category);
        // Sort by score and assign category-specific ranks
        return categoryTeams.sort((a, b) => b.score - a.score).map((team, index) => ({
            ...team,
            categoryRank: index + 1 // 1, 2, 3, etc. within this category
        }));
    };

    const categoryData = getCategoryData(selectedCategory);
    const topThree = categoryData.slice(0, 3);
    const remainingTeams = categoryData.slice(3);

    const filteredData = categoryData;

    useEffect(() => {
        // Only show countdown on initial load
        if (showCountdown && countdown > 0) {
            const countdownTimer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(countdownTimer);
        } else if (showCountdown && countdown === 0) {
            setShowCountdown(false);

            // Show podium after countdown
            const podiumTimer = setTimeout(() => {
                setShowPodium(true);
                triggerConfetti('podium');
            }, 500);

            // Start revealing remaining cards after podium is shown
            const startRevealTimer = setTimeout(() => {
                setIsLoaded(true);
            }, 2500);

            return () => {
                clearTimeout(podiumTimer);
                clearTimeout(startRevealTimer);
            };
        }
    }, [countdown, showCountdown]);

    // Auto-reveal cards one by one
    useEffect(() => {
        if (isLoaded && currentRevealIndex < filteredData.length + 1) {
            const timer = setTimeout(() => {
                if (currentRevealIndex <= remainingTeams.length + 3) {
                    setRevealedCards(prev => new Set([...prev, currentRevealIndex]));
                    setCurrentRevealIndex(prev => prev + 1);
                }
            }, 800); // Reveal every 800ms

            return () => clearTimeout(timer);
        }
    }, [isLoaded, currentRevealIndex, filteredData.length, remainingTeams.length]);

    // Reset reveal state when category changes
    useEffect(() => {
        if (selectedCategory) { // Reset for any category change
            setRevealedCards(new Set());
            setCurrentRevealIndex(4); // Start revealing from 4th position (after top 3)
            setIsLoaded(false);
            setShowPodium(false);
            setShowCountdown(selectedCategory === "Data Hackathon"); // Show countdown only for initial load

            // Restart the reveal process
            const podiumTimer = setTimeout(() => {
                setShowPodium(true);
                triggerConfetti('podium');
            }, selectedCategory === "Data Hackathon" ? 200 : 100);

            const startRevealTimer = setTimeout(() => {
                setIsLoaded(true);
            }, selectedCategory === "Data Hackathon" ? 1000 : 600);

            return () => {
                clearTimeout(podiumTimer);
                clearTimeout(startRevealTimer);
            };
        }
    }, [selectedCategory]);

    const triggerConfetti = (type = 'default') => {
        const count = type === 'podium' ? 300 : 200;
        const defaults = {
            origin: { y: type === 'podium' ? 0.8 : 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        if (type === 'podium') {
            // Special podium confetti with golden colors
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
                colors: ['#22d3ee', '#3b82f6', '#06b6d4', '#0ea5e9']
            });
            fire(0.2, {
                spread: 60,
                colors: ['#22d3ee', '#3b82f6', '#06b6d4', '#0ea5e9']
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
                colors: ['#22d3ee', '#3b82f6', '#06b6d4', '#0ea5e9']
            });
        } else {
            // Regular confetti
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
        }

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Countdown Overlay */}
            {showCountdown && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Results Revealing In...
                        </h2>
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500"
                        >
                            {countdown || "🎉"}
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center mb-6 mt-18">
                            <Trophy className="w-16 h-16 text-cyan-400 mr-4" />
                            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                                Leaderboard
                            </h1>
                            <Trophy className="w-16 h-16 text-cyan-400 ml-4" />
                        </div>
                        <p className="text-xl text-gray-300 mb-8">
                            5th National Data Science Summit 2026 - Competition Results
                        </p>
                        <div className="flex items-center justify-center text-gray-400">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>Updated: November 29, 2025</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                triggerConfetti();
                            }}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                ? 'bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg transform scale-105'
                                : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700/80 hover:shadow-md border border-slate-600/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Winners Podium */}
            {topThree.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    {/* Category Indicator */}
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className={`inline-flex items-center px-6 py-3 rounded-full text-white font-semibold text-lg ${categoryColors[selectedCategory]} shadow-lg`}>
                            <Trophy className="w-6 h-6 mr-2" />
                            {selectedCategory} - Top Winners
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-3xl font-bold text-center text-white mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                    </motion.h2>

                    <div className="flex justify-center items-end gap-4 md:gap-8">
                        {topThree.map((team) => (
                            <PodiumCard
                                key={team.rank}
                                team={team}
                                position={team.rank}
                                isVisible={showPodium}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Remaining Teams */}
            {remainingTeams.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-300 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoaded ? 1 : 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        Other Participants
                    </motion.h2>

                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                        {remainingTeams.map((team, index) => (
                            <motion.div
                                key={`${selectedCategory}-${team.categoryRank || team.rank}`}
                                initial={{ opacity: 0, x: -100, rotateY: -90 }}
                                animate={revealedCards.has(index + 4) ? { // Start from 4 (after top 3)
                                    opacity: 1,
                                    x: 0,
                                    rotateY: 0,
                                    transition: {
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 100
                                    }
                                } : {}}
                            >
                                <LeaderboardCard
                                    team={team}
                                    index={index}
                                    isVisible={revealedCards.has(index + 4)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Manual Reveal Button for remaining cards */}
            {remainingTeams.length > (revealedCards.size - 3) && isLoaded && (
                <div className="text-center mb-16">
                    <motion.button
                        onClick={() => {
                            // Reveal all remaining cards at once
                            const allIndexes = remainingTeams.map((team, index) => index + 4);
                            setRevealedCards(new Set([...revealedCards, ...allIndexes]));
                            setCurrentRevealIndex(filteredData.length + 1);
                            triggerConfetti();
                        }}
                        className="bg-linear-to-r from-cyan-400 to-blue-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reveal All Results ✨
                    </motion.button>
                </div>
            )}

            {/* Celebration Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={triggerConfetti}
                    className="p-4 bg-linear-to-r from-cyan-400 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <Trophy className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-20 left-10 w-32 h-32 bg-linear-to-r from-cyan-400/20 to-blue-400/20 rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-20 right-10 w-40 h-40 bg-linear-to-r from-blue-400/20 to-cyan-400/20 rounded-full"
                />
                <motion.div
                    animate={{
                        y: [-20, 20, -20],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/4 w-24 h-24 bg-linear-to-r from-slate-400/20 to-gray-400/20 rounded-full"
                />
            </div>
        </div>
    );
}