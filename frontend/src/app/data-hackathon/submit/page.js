'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SubmissionPage() {
    const [formData, setFormData] = useState({
        teamName: '',
        teamLeader: '',
        teamMembers: '',
        email: '',
        phone: '',
        institution: '',
        projectTitle: '',
        projectDescription: '',
        githubRepo: '',
        demoLink: ''
    });

    const [actualValues, setActualValues] = useState([]);
    const [predictedValues, setPredictedValues] = useState([]);
    const [f1Results, setF1Results] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateF1Score = () => {
        try {
            if (actualValues.length === 0 || predictedValues.length === 0) {
                alert('Please upload your predictions CSV file');
                return;
            }

            if (actualValues.length !== predictedValues.length) {
                alert('Actual and predicted values must have the same length');
                return;
            }

            // Calculate confusion matrix for binary classification
            let tp = 0, fp = 0, tn = 0, fn = 0;

            for (let i = 0; i < actualValues.length; i++) {
                const actual = parseInt(actualValues[i]);
                const predicted = parseInt(predictedValues[i]);

                if (actual === 1 && predicted === 1) tp++;
                else if (actual === 0 && predicted === 1) fp++;
                else if (actual === 0 && predicted === 0) tn++;
                else if (actual === 1 && predicted === 0) fn++;
            }

            const precision = tp / (tp + fp) || 0;
            const recall = tp / (tp + fn) || 0;
            const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
            const accuracy = (tp + tn) / (tp + fp + tn + fn) || 0;

            setF1Results({
                precision: precision.toFixed(4),
                recall: recall.toFixed(4),
                f1Score: f1Score.toFixed(4),
                accuracy: accuracy.toFixed(4),
                confusionMatrix: { tp, fp, tn, fn },
                totalSamples: actualValues.length
            });

        } catch (error) {
            alert('Error calculating F1 score. Please check your CSV file format.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate submission process
        setTimeout(() => {
            alert('Submission successful! Leaderboard will be updated soon.');
            setIsSubmitting(false);
        }, 2000);
    };

    // Load actual values from static CSV file
    React.useEffect(() => {
        fetch('/actual.csv')
            .then(response => response.text())
            .then(csvData => {
                const lines = csvData.split('\n');
                const values = lines.slice(1)
                    .map(line => line.split(',')[0].trim())
                    .filter(val => val !== '' && !isNaN(val))
                    .map(val => parseInt(val));
                setActualValues(values);
            })
            .catch(error => {
                console.error('Error loading ground truth data:', error);
            });
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setUploadedFile(file.name);

            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                const lines = csvData.split('\n');
                // Skip header row and get first column values
                const values = lines.slice(1)
                    .map(line => line.split(',')[0].trim())
                    .filter(val => val !== '' && !isNaN(val))
                    .map(val => parseInt(val));

                setPredictedValues(values);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSV file');
        }
    };

    return (
        <div className="bg-slate-950 text-gray-100 min-h-screen">
            {/* Header Section */}
            <section className="text-center py-20 px-4 max-w-5xl mx-auto">
                <Link href="/data-hackathon" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                    ← Back to Data Hackathon
                </Link>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tighter">
                    PROJECT SUBMISSION
                </h1>
                <p className="text-xl text-gray-400 font-light">
                    Submit Your AI Solution & Calculate Performance Metrics
                </p>
            </section>

            <main className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Submission Form */}
                    <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">1</span>
                            Project Information
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Team Details */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Team Name *</label>
                                    <input
                                        type="text"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Team Leader *</label>
                                    <input
                                        type="text"
                                        name="teamLeader"
                                        value={formData.teamLeader}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Team Members</label>
                                <textarea
                                    name="teamMembers"
                                    value={formData.teamMembers}
                                    onChange={handleInputChange}
                                    placeholder="List all team members (one per line)"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Institution *</label>
                                <input
                                    type="text"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                    required
                                />
                            </div>

                            {/* Project Details */}
                            <div className="pt-6 border-t border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Project Title *</label>
                                    <input
                                        type="text"
                                        name="projectTitle"
                                        value={formData.projectTitle}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-300 font-medium mb-2">Project Description *</label>
                                    <textarea
                                        name="projectDescription"
                                        value={formData.projectDescription}
                                        onChange={handleInputChange}
                                        placeholder="Describe your project, methodology, and key features"
                                        rows="4"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-2">GitHub Repository</label>
                                        <input
                                            type="url"
                                            name="githubRepo"
                                            value={formData.githubRepo}
                                            onChange={handleInputChange}
                                            placeholder="https://github.com/username/repo"
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-2">Demo Link</label>
                                        <input
                                            type="url"
                                            name="demoLink"
                                            value={formData.demoLink}
                                            onChange={handleInputChange}
                                            placeholder="https://your-demo-link.com"
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Project'}
                            </button>
                        </form>
                    </div>

                    {/* F1 Score Calculator */}
                    <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">2</span>
                            F1 Score Calculator
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl">
                                    <h4 className="text-blue-400 font-semibold mb-2">📊 Ground Truth Data</h4>
                                    <p className="text-sm text-gray-300 mb-2">
                                        The actual/ground truth values are pre-loaded from our dataset.
                                    </p>
                                    <p className="text-xs text-green-400">
                                        ✓ Ground truth data loaded ({actualValues.length} samples)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Upload Your Model Predictions (CSV)</label>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                                    />
                                    {uploadedFile && (
                                        <p className="mt-2 text-sm text-green-400">✓ Uploaded: {uploadedFile}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={calculateF1Score}
                                disabled={actualValues.length === 0 || predictedValues.length === 0}
                                className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Calculate F1 Score
                            </button>

                            {/* Results Display */}
                            {f1Results && (
                                <div className="mt-8 p-6 bg-slate-800/60 rounded-xl border border-green-500/30">
                                    <h3 className="text-xl font-bold text-green-400 mb-4">Performance Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{f1Results.f1Score}</div>
                                            <div className="text-sm text-gray-400">F1 Score</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{f1Results.accuracy}</div>
                                            <div className="text-sm text-gray-400">Accuracy</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{f1Results.precision}</div>
                                            <div className="text-sm text-gray-400">Precision</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{f1Results.recall}</div>
                                            <div className="text-sm text-gray-400">Recall</div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold text-white mb-2">Confusion Matrix</h4>
                                        <div className="grid grid-cols-2 gap-2 max-w-xs">
                                            <div className="text-center p-2 bg-blue-600/20 rounded text-blue-300">
                                                <div className="font-bold">{f1Results.confusionMatrix.tn}</div>
                                                <div className="text-xs">TN</div>
                                            </div>
                                            <div className="text-center p-2 bg-red-600/20 rounded text-red-300">
                                                <div className="font-bold">{f1Results.confusionMatrix.fp}</div>
                                                <div className="text-xs">FP</div>
                                            </div>
                                            <div className="text-center p-2 bg-red-600/20 rounded text-red-300">
                                                <div className="font-bold">{f1Results.confusionMatrix.fn}</div>
                                                <div className="text-xs">FN</div>
                                            </div>
                                            <div className="text-center p-2 bg-green-600/20 rounded text-green-300">
                                                <div className="font-bold">{f1Results.confusionMatrix.tp}</div>
                                                <div className="text-xs">TP</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl">
                                <h4 className="text-blue-400 font-semibold mb-2">📝 Instructions</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>• Upload CSV files with binary values (0 or 1) for classification problems</li>
                                    <li>• CSV files should have values in the first column</li>
                                    <li>• Ensure actual and predicted values have the same length</li>
                                    <li>• First row will be treated as header and skipped</li>
                                    <li>• Your predictions will be evaluated against the pre-loaded ground truth</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}