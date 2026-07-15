'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PromptCraftSubmissionPage() {
    const [formData, setFormData] = useState({
        participantName: '',
        email: '',
        phone: '',
        institution: '',
        projectTitle: '',
        projectDescription: '',
        promptUsed: '',
        toolsUsed: '',
        creativeStatement: '',
        videoUrl: '',
        thumbnailUrl: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({
        video: null,
        thumbnail: null,
        additionalImages: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrls, setPreviewUrls] = useState({
        thumbnail: null,
        additionalImages: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
                alert('Video file size must be less than 100MB');
                return;
            }

            // Check file type
            const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid video file (MP4, AVI, MOV, WMV, WebM)');
                return;
            }

            setUploadedFiles(prev => ({
                ...prev,
                video: file
            }));
        }
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            setUploadedFiles(prev => ({
                ...prev,
                thumbnail: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrls(prev => ({
                    ...prev,
                    thumbnail: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxFiles = 5;

        if (files.length > maxFiles) {
            alert(`You can upload a maximum of ${maxFiles} additional images`);
            return;
        }

        const validFiles = [];
        const validPreviews = [];

        files.forEach(file => {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (allowedTypes.includes(file.type)) {
                validFiles.push(file);

                // Create preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    validPreviews.push(event.target.result);
                    if (validPreviews.length === validFiles.length) {
                        setPreviewUrls(prev => ({
                            ...prev,
                            additionalImages: validPreviews
                        }));
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        setUploadedFiles(prev => ({
            ...prev,
            additionalImages: validFiles
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!formData.participantName || !formData.email || !formData.projectTitle || !formData.promptUsed) {
            alert('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        if (!uploadedFiles.video && !formData.videoUrl) {
            alert('Please either upload a video file or provide a video URL');
            setIsSubmitting(false);
            return;
        }

        // Simulate submission process
        setTimeout(() => {
            alert('Submission successful! Your PromptCraft entry has been received. You will get a confirmation email shortly.');
            setIsSubmitting(false);

            // Reset form
            setFormData({
                participantName: '',
                email: '',
                phone: '',
                institution: '',
                projectTitle: '',
                projectDescription: '',
                promptUsed: '',
                toolsUsed: '',
                creativeStatement: '',
                videoUrl: '',
                thumbnailUrl: ''
            });
            setUploadedFiles({
                video: null,
                thumbnail: null,
                additionalImages: []
            });
            setPreviewUrls({
                thumbnail: null,
                additionalImages: []
            });
        }, 2000);
    };

    return (
        <div className="bg-slate-950 text-gray-100 min-h-screen">
            {/* Header Section */}
            <section className="text-center py-20 px-4 max-w-5xl mx-auto">
                <Link href="/promptcraft" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                    ← Back to PromptCraft
                </Link>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tighter">
                    🎬 PROMPTCRAFT SUBMISSION
                </h1>
                <p className="text-xl text-gray-400 font-light">
                    Submit Your Creative Video & Visual Masterpiece
                </p>
            </section>

            <main className="max-w-4xl mx-auto px-4 pb-20">
                <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Participant Information */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">1</span>
                                Participant Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="participantName"
                                        value={formData.participantName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Institution</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-6 pt-6 border-t border-gray-700">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">2</span>
                                Project Details
                            </h2>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    name="projectTitle"
                                    value={formData.projectTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Project Description *</label>
                                <textarea
                                    name="projectDescription"
                                    value={formData.projectDescription}
                                    onChange={handleInputChange}
                                    placeholder="Describe your creative concept, storyline, and the message you want to convey"
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Prompt Used *</label>
                                <textarea
                                    name="promptUsed"
                                    value={formData.promptUsed}
                                    onChange={handleInputChange}
                                    placeholder="Share the exact prompt(s) you used to create your video/images"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-6 pt-6 border-t border-gray-700">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3">3</span>
                                Media Upload
                            </h2>

                            {/* Video Upload/URL */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">Video Submission</h3>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Upload Video File</label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                                    />
                                    <p className="mt-2 text-sm text-gray-400">Max size: 100MB. Supported formats: MP4, AVI, MOV, WMV, WebM</p>
                                    {uploadedFiles.video && (
                                        <p className="mt-2 text-sm text-green-400">✓ Uploaded: {uploadedFiles.video.name}</p>
                                    )}
                                </div>

                                <div className="text-center text-gray-400 font-medium">OR</div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Video URL (YouTube, Vimeo, etc.)</label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={formData.videoUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Submission Guidelines */}
                        <div className="p-6 bg-blue-600/10 border border-blue-600/30 rounded-xl">
                            <h4 className="text-blue-400 font-semibold mb-2">📝 Submission Guidelines</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• Ensure your video is original and created using AI tools</li>
                                <li>• Video length should be between 30 seconds to 3 minutes</li>
                                <li>• Include clear documentation of the prompts used</li>
                                <li>• High-quality thumbnail recommended for better presentation</li>
                                <li>• Additional images can showcase your creative process</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                '🎬 Submit PromptCraft Entry'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}