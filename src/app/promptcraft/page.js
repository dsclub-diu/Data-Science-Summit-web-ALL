'use client';

import React from 'react';
import Link from 'next/link';

export default function PromptcraftPage() {
  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen py-18">
      <div className="max-w-4xl mx-auto p-4 md:p-8">

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            🎬✨ PROMPT VIDEO MAKING CHALLENGE 2025 ✨🎬
          </h1>
          <p className="text-xl text-blue-400 font-semibold mb-3">
            🔥 Unleash Your Creativity. Craft Your Story. Inspire the Future. 🔥
          </p>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Your step-by-step guide to conceptualizing and creating a compelling video under constraint.
          </p>

          {/* MAIN REGISTRATION BUTTON */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTP-TovwzsL4lks-GxRMyYZERPqMxzavkIbaN8JMVFZzM2Ag/viewform"
            target="_blank"
            className="inline-block mt-8 px-10 py-4 text-xl font-bold text-white rounded-full shadow-lg bg-linear-to-r from-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-blue-500/50"
            aria-label="Register for the Prompt Video Making Challenge"
          >
            ✏️ Register Now - Don&apos;t Miss Out!
          </Link>
        </header>

        {/* Section 0: Challenge Overview and Goals */}
        <div className="step-card p-6 md:p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-4">
            <span className="text-3xl mr-3 text-blue-500">✨</span>
            Challenge Overview: The Power of the Prompt
          </h2>
          <p className="text-slate-300 mb-4 font-semibold">
            Think of it as a canvas 🎨 where your prompt becomes the brush, your mind becomes the paint, and your video becomes the masterpiece that inspires everyone!
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Goals */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <span className="text-xl mr-2 text-emerald-400">🎯</span>
                Key Goals
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Transform ideas into visual creativity</li>
                <li>Present real-world concepts through storytelling</li>
                <li>Engage your audience with powerful prompts</li>
                <li>Showcase creativity in just <strong>1 minute</strong> of video magic</li>
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <span className="text-xl mr-2 text-amber-400">⭐</span>
                Why Participate?
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Push your creativity beyond limits</li>
                <li>Strengthen problem-solving & critical thinking</li>
                <li>Highlight your talent to judges, mentors & peers</li>
                <li>Boost your profile with certificates & achievements</li>
                <li>Be part of one of Bangladesh&apos;s biggest student innovation events</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="connector"></div>

        {/* Section 1: Understand the Challenge */}
        <div className="step-card p-6 md:p-8 rounded-xl">
          <div className="step-number">1</div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-3">
              <span className="text-3xl mr-3 text-sky-400">🔍</span>
              Understand the Challenge (The Prep)
            </h2>
            <p className="text-slate-400 mb-4">The first step is about research and clarity. Know the boundaries before you begin creating.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Read the Rules:</strong> Note the deadline, video length limit (e.g., 60 seconds), submission format, and required hashtags.</li>
              <li><strong>Study the Prompt:</strong> Analyze the constraint (word, phrase, image, or theme). What is the core idea you must address?</li>
              <li><strong>Check for Required Elements:</strong> Identify any mandatory inclusions like a specific sound effect, line of dialogue, or prop.</li>
            </ul>
          </div>
        </div>

        <div className="connector"></div>

        {/* Section 2: Conceptualize Your Video */}
        <div className="step-card p-6 md:p-8 rounded-xl">
          <div className="step-number">2</div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-3">
              <span className="text-3xl mr-3 text-sky-400">💡</span>
              Conceptualize Your Video (The Interpretation)
            </h2>
            <p className="text-slate-400 mb-4">Translate the prompt into a visual story that you can realistically produce.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Brainstorm & Select:</strong> Generate many ideas, then choose the one that is both compelling and <strong>achievable</strong> within your time and resources.</li>
              <li><strong>Develop the Narrative:</strong> Outline the story flow: a clear beginning (setup), middle (conflict/action), and end (resolution/punchline).</li>
              <li><strong>Plan Your Shots:</strong> Create a simple shot list or storyboard. Decide on camera angles and movements (e.g., zoom in, wide shot).</li>
            </ul>
          </div>
        </div>

        <div className="connector"></div>

        {/* Section 3: Create the Video */}
        <div className="step-card p-6 md:p-8 rounded-xl">
          <div className="step-number">3</div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-3">
              <span className="text-3xl mr-3 text-sky-400">🎥</span>
              Create the Video (Execution)
            </h2>
            <p className="text-slate-400 mb-4">The production phase, whether you are filming or using AI to generate the visuals.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Gather Resources:</strong> Secure your camera, lighting, location, and any necessary props or actors.</li>
              <li><strong>Shoot/Generate Footage:</strong> Film all planned shots (or use your refined text prompts to generate all necessary clips, focusing on variety).</li>
              <li><strong>Take B-roll:</strong> Get extra footage (B-roll) that can be used to cover transitions, add visual interest, or hide mistakes.</li>
            </ul>
          </div>
        </div>

        <div className="connector"></div>

        {/* Section 4: Edit the Video */}
        <div className="step-card p-6 md:p-8 rounded-xl">
          <div className="step-number">4</div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-3">
              <span className="text-3xl mr-3 text-sky-400">✂️</span>
              Edit the Video (The Polish)
            </h2>
            <p className="text-slate-400 mb-4">This is where the footage comes together and the story finds its rhythm.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Assemble & Cut:</strong> Sequence your clips and trim them for pacing. Keep the cuts dynamic, especially for short videos.</li>
              <li><strong>Add Sound Design:</strong> Layer in music, ambient sound, and specific sound effects to enhance the mood.</li>
              <li><strong>Refine Visuals:</strong> Apply color grading, add text overlays, and ensure the resolution meets the submission requirements.</li>
              <li><strong>Final Compliance Check:</strong> Double-check that you are under the time limit and all required challenge elements are present.</li>
            </ul>
          </div>
        </div>

        <div className="connector"></div>

        {/* Section 5: Submission */}
        <div className="step-card p-6 md:p-8 rounded-xl">
          <div className="step-number">5</div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-3">
              <span className="text-3xl mr-3 text-sky-400">📤</span>
              Submission (The Finale)
            </h2>
            <p className="text-slate-400 mb-4">The final step: sharing your creation with the world and the contest host!</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Export:</strong> Render your final video file in the required format (usually MP4).</li>
              <li><strong>Upload:</strong> Submit the video to the designated platform (YouTube, Instagram, contest portal).</li>
              <li><strong>Tag & Hashtag:</strong> Include the official challenge hashtags and the original prompt in your video&apos;s title and description. Tag the challenge host/organizer.</li>
              <li><strong>Share:</strong> Promote your entry and engage with the community!</li>
            </ul>
          </div>
        </div>

        {/* Section 6: Prizes and Rewards */}
        <div className="connector"></div>

        <div className="step-card p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-4">
            <span className="text-3xl mr-3 text-amber-400">🏆</span>
            🏆 Prizes & Rewards
          </h2>
          <p className="text-slate-300 mb-4 font-semibold">
            With a total prize pool of 11,000 BDT, this is your chance to shine and be recognized!
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
            {/* 1st Place */}
            <div className="bg-yellow-900/40 p-4 rounded-lg border border-yellow-700/50">
              <span className="text-3xl text-yellow-400 mb-1 block">🏅</span>
              <p className="font-bold text-xl text-white">🥇 1st Place</p>
              <p className="text-lg text-yellow-300">4,000 BDT</p>
            </div>
            {/* 2nd Place */}
            <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50">
              <span className="text-3xl text-gray-400 mb-1 block">🏅</span>
              <p className="font-bold text-xl text-white">🥈 2nd Place</p>
              <p className="text-lg text-gray-300">3,000 BDT</p>
            </div>
            {/* 3rd Place */}
            <div className="bg-yellow-800/40 p-4 rounded-lg border border-yellow-800/50">
              <span className="text-3xl text-yellow-600 mb-1 block">🏅</span>
              <p className="font-bold text-xl text-white">🥉 3rd Place</p>
              <p className="text-lg text-yellow-500">2,000 BDT</p>
            </div>
            <div className="bg-blue-800/40 p-4 rounded-lg border border-blue-800/50">
              <span className="text-3xl text-blue-600 mb-1 block">🏅</span>
              <p className="font-bold text-xl text-white">🥉 4th Place</p>
              <p className="text-lg text-blue-500">1,000 BDT</p>
            </div>
            <div className="bg-green-800/40 p-4 rounded-lg border border-green-800/50">
              <span className="text-3xl text-green-600 mb-1 block">🏅</span>
              <p className="font-bold text-xl text-white">🥉 5th Place</p>
              <p className="text-lg text-green-500">1,000 BDT</p>
            </div>
          </div>


          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <span className="text-xl mr-2 text-fuchsia-400">🎁</span>
            Rewards for Every Participant:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 grid md:grid-cols-2">
            <li>👕 Official Event T-shirt</li>
            <li>🎖 Certificate of Participation</li>
            <li>🍩 Refreshments</li>
            <li>🌟 Recognition & Exposure</li>
            <li>📸 Photos to share & remember!</li>
          </ul>
        </div>

        {/* Section 7: Event Details and Registration */}
        <div className="connector"></div>

        <div className="step-card p-6 md:p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-4">
            <span className="text-3xl mr-3 text-indigo-400">📅</span>
            Event Details & Registration
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <p className="mb-2">
                <span className="font-bold text-white block">Date & Time:</span>
                <span className="mr-2 text-indigo-400">📅</span>
                December 11, 2025 (12:30 PM – 1:30 PM)
              </p>
              <p className="mb-2">
                <span className="font-bold text-white block">Venue:</span>
                <span className="mr-2 text-indigo-400">📍</span>
                DIU Smart City, Birulia, Savar
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="mb-2">
                <span className="font-bold text-white block">Registration Deadline:</span>
                <span className="mr-2 text-indigo-400">⏰</span>
                <strong>December 5, 2025</strong>
              </p>
              <div className="text-center mt-4 md:text-left">
                <p className="mb-2">
                  <span className="font-bold text-white block">Registration Fee:</span>
                  <span className="mr-2 text-indigo-400">💰</span>
                  <strong>200 BDT per participant</strong>
                </p>
              </div>
              <p className="mb-2 text-sm text-red-400 font-semibold">Don&apos;t wait! Spots are limited for this innovative event.</p>
            </div>

          </div>

          {/* REGISTRATION BUTTON IN FOOTER SECTION */}
          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfTP-TovwzsL4lks-GxRMyYZERPqMxzavkIbaN8JMVFZzM2Ag/viewform"
              target="_blank"
              className="cta-button inline-block px-8 py-3 text-lg font-bold text-white rounded-lg shadow-xl"
              aria-label="Register Online via Registration Link"
            >
              🔗 Register Online Here (Registration Link)
            </Link>
          </div>

          <div className="mt-6 p-4 bg-slate-700/40 rounded-lg border border-slate-600/50">
            <h3 className="font-bold text-white mb-2">Official Hashtags:</h3>
            <p className="text-sm text-slate-400 break-all">
              #PromptVideoChallenge #DIUSummit2025 #CreateWithAI #StudentCreativity #InspireThroughVideo #DigitalCreators #InnovationBeginsHere #AIStorytelling #CraftYourPrompt #DIUEvents #CreatorMindset #FutureLeaders
            </p>
          </div>
        </div>

      </div>
    </div >
  );
}