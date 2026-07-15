'use client';
import {
    Lightbulb,
    FileText,
    UserCheck,
    LayoutTemplate,
    Megaphone,
    Target,
    ListChecks,
    Pencil,
    LayoutGrid,
    Image,
    Paintbrush,
    Eye,
    Printer,
    Mic,
    Handshake,
    Sparkles,
    Calendar,
    Trophy,
    Users,
    Timer
} from 'lucide-react';

export default function ResearchPosterPage() {
    return (
        <>
            <style jsx>{`
        /* Custom styling for the vertical timeline line/connector */
        .timeline-line {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 20px; /* Adjust to align with the icon circles */
          width: 4px;
          background-color: #38bdf8; /* Cyan-400 line for tech feel */
          z-index: 0;
        }
        /* Use a custom color for the process section - Deep Slate */
        .process-bg {
          background-color: #0f172a; /* Slate 900 */
        }
      `}</style>

            <div className="bg-slate-900 text-white min-h-screen font-sans scroll-smooth  py-22">

                <div className="max-w-6xl mx-auto p-4 sm:p-8">

                    {/* Header and Main Title */}
                    <header className="text-center py-10 mb-8 bg-slate-800 rounded-xl shadow-lg border-b-4 border-cyan-400">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">Idea Poster Presentation</h1>
                        <p className="text-xl text-gray-300 font-medium">A Step-by-Step Infographic Guide</p>
                    </header>

                    {/* Event Announcement */}
                    <section className="mb-12">
                        <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-cyan-400">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-slate-900 uppercase bg-cyan-400 rounded-full">Spotlight Event</span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 mr-3 text-yellow-400 fill-yellow-200" />
                                    5th National Data Science Summit 2026
                                </h2>
                                <p className="text-xl font-bold text-cyan-300 mb-6">Theme: AI in Entrepreneurship</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                {/* Date & Location */}
                                <div className="p-4 bg-slate-700 rounded-lg shadow-md border-b-2 border-cyan-400">
                                    <Calendar className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                                    <p className="font-semibold text-white">July 12, 2026 (09:00 am - 05:00 pm)</p>
                                    <p className="text-sm text-gray-300">Daffodil Smart City, Dhaka</p>
                                </div>

                                {/* Awards */}
                                <div className="p-4 bg-slate-700 rounded-lg shadow-md border-b-2 border-cyan-400">
                                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400 fill-yellow-200" />
                                    <p className="font-semibold text-white">Total Prize Pool: 10,000 BDT</p>
                                    <p className="text-sm text-gray-300">Champion: 5K, 1st Runner-up: 3K, 2nd Runner-up: 2K</p>
                                </div>

                                {/* Eligibility */}
                                <div className="p-4 bg-slate-700 rounded-lg shadow-md border-b-2 border-cyan-400">
                                    <Users className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                                    <p className="font-semibold text-white">Who Can Join?</p>
                                    <p className="text-sm text-gray-300">Students (Team of 2 members)</p>
                                </div>
                            </div>

                            {/* Call to Action & Deadline */}
                            <div className="mt-8">
                                <div className="grid md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-2 space-y-3 text-left">
                                        <h3 className="text-2xl font-bold text-white">Registration & Fees</h3>
                                        <p className="text-gray-300">Individual: <span className="font-semibold text-cyan-300">400 BDT</span></p>
                                        <p className="text-gray-300">Team (2 members): <span className="font-semibold text-cyan-300">800 BDT</span></p>
                                        <p className="text-sm text-cyan-200/80">All club members receive a <span className="font-bold">10% discount</span>. Bring membership proof at the event.</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="inline-flex items-center px-4 py-3 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg shadow-inner">
                                            <Timer className="w-5 h-5 mr-2 text-red-300" />
                                            <div className="text-left">
                                                <div className="text-xs uppercase text-red-200/80">Submission Deadline</div>
                                                <div className="font-bold text-red-300">June 25, 2026</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                                    <a
                                        href="https://forms.gle/gEdAtds8o9jN9bUV9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-cyan-400 to-blue-500 text-slate-900 font-semibold rounded-xl shadow-lg hover:from-cyan-300 hover:to-blue-400 transition"
                                    >
                                        🔗 Register Now
                                    </a>

                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12">
                        <div className="bg-slate-800 p-6 sm:p-10 rounded-xl shadow-lg border-t-4 border-cyan-400">
                            <h2 className="text-3xl font-bold mb-4 flex items-center text-white">
                                <Lightbulb className="w-7 h-7 mr-3 text-yellow-400 fill-yellow-200" />
                                What is it?
                            </h2>
                            <div className="space-y-4 text-lg">
                                <p className="font-semibold text-gray-200">An idea poster presentation focuses on communicating a concept, hypothesis, or proposed project plan rather than completed results.</p>
                                <ul className="list-none space-y-2 pl-0">
                                    <li className="flex items-start">
                                        <FileText className="w-5 h-5 mt-1 mr-2 shrink-0 text-cyan-400" />
                                        <span className="text-gray-300">A Physical or Digital Poster: Summarizes your idea using text, graphics, charts, and images.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <UserCheck className="w-5 h-5 mt-1 mr-2 shrink-0 text-cyan-400" />
                                        <span className="text-gray-300">A Short Presentation/Discussion: Briefly explain your idea and engage with attendees for feedback.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                                <p className="text-cyan-300 font-bold">Primary Goal: Solicit feedback, find collaborators, or gauge interest in your proposed work *before* extensive research or development.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Tasks */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-6 text-white">📝 What You Have to Do</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Task 1: Design */}
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-cyan-400 transition hover:shadow-xl hover:bg-slate-700">
                                <div className="flex items-center mb-3">
                                    <LayoutTemplate className="w-8 h-8 mr-3 text-cyan-400" />
                                    <h3 className="text-2xl font-bold text-white">Task 1: Design & Prepare</h3>
                                </div>
                                <p className="text-gray-300">Create a poster that clearly and compellingly communicates your idea. Focus on visual appeal and succinctness.</p>
                            </div>
                            {/* Task 2: Presentation */}
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-cyan-400 transition hover:shadow-xl hover:bg-slate-700">
                                <div className="flex items-center mb-3">
                                    <Megaphone className="w-8 h-8 mr-3 text-cyan-400" />
                                    <h3 className="text-2xl font-bold text-white">Task 2: Present & Discuss</h3>
                                </div>
                                <p className="text-gray-300">Stand by your poster during the session, pitch your idea, and engage in constructive discussions to gather feedback.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Step-by-Step Process */}
                    <section className="process-bg p-6 sm:p-10 rounded-xl shadow-2xl text-white">
                        <h2 className="text-4xl font-extrabold text-center mb-10 text-white border-b-4 border-cyan-400 pb-4">🚀 Step-by-Step Process</h2>

                        {/* Timeline Container */}
                        <div className="relative">
                            {/* Vertical Line Connector */}
                            <div className="hidden sm:block timeline-line"></div>

                            {/* Phase 1: Conceptualization and Content Creation */}
                            <div className="mb-12 relative z-10">
                                <div className="sm:flex items-center mb-4">
                                    <div className="shrink-0 w-full sm:w-auto flex justify-start sm:justify-center">
                                        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg text-slate-900 font-bold text-xl ring-4 ring-slate-700">1</div>
                                    </div>
                                    <h3 className="text-2xl font-bold ml-5 text-cyan-300 mt-2 sm:mt-0">Phase 1: Conceptualization and Content Creation</h3>
                                </div>
                                <div className="sm:ml-16 space-y-4 border-l-2 sm:border-l-0 border-cyan-400 pl-4 sm:pl-0 pt-2">
                                    {/* Step 1 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Target className="w-4 h-4 mr-2 text-cyan-400" /> 1. Define Your Core Idea
                                        </h4>
                                        <p className="text-sm text-gray-300">Articulate the Problem, the Proposed Solution/Hypothesis, and the Potential Impact (Why it matters).</p>
                                    </div>
                                    {/* Step 2 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <ListChecks className="w-4 h-4 mr-2 text-cyan-400" /> 2. Outline the Poster Sections
                                        </h4>
                                        <p className="text-sm text-gray-300">Include: Title, Motivation, Proposed Idea/Methodology, Expected Results/Impact, Future Work, and Call to Action/Feedback.</p>
                                    </div>
                                    {/* Step 3 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Pencil className="w-4 h-4 mr-2 text-cyan-400" /> 3. Draft the Text
                                        </h4>
                                        <p className="text-sm text-gray-300">Keep it brief (bullet points, short phrases). Focus on the future. The audience should grasp the idea in under 5 minutes.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 2: Design and Visual Execution */}
                            <div className="mb-12 relative z-10">
                                <div className="sm:flex items-center mb-4">
                                    <div className="shrink-0 w-full sm:w-auto flex justify-start sm:justify-center">
                                        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg text-slate-900 font-bold text-xl ring-4 ring-slate-700">2</div>
                                    </div>
                                    <h3 className="text-2xl font-bold ml-5 text-cyan-300 mt-2 sm:mt-0">Phase 2: Design and Visual Execution</h3>
                                </div>
                                <div className="sm:ml-16 space-y-4 border-l-2 sm:border-l-0 border-cyan-400 pl-4 sm:pl-0 pt-2">
                                    {/* Step 4 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <LayoutGrid className="w-4 h-4 mr-2 text-blue-400" /> 4. Choose a Design Template and Layout
                                        </h4>
                                        <p className="text-sm text-gray-300">Check conference size guidelines. Use a grid system (3-5 columns) to guide the viewer&apos;s eye logically.</p>
                                    </div>
                                    {/* Step 5 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Image className="w-4 h-4 mr-2 text-blue-400" /> 5. Prioritize Visuals
                                        </h4>
                                        <p className="text-sm text-gray-300">Visuals (diagrams, flowcharts, images) should take up 40-60% of the poster space. They explain the method.</p>
                                    </div>
                                    {/* Step 6 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Paintbrush className="w-4 h-4 mr-2 text-blue-400" /> 6. Refine Formatting
                                        </h4>
                                        <p className="text-sm text-gray-300">Ensure high contrast. Use ample white space. Body text should be at least 24pt. Limit color palette to 2-3 main colors.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3: Finalization and Presentation */}
                            <div className="relative z-10">
                                <div className="sm:flex items-center mb-4">
                                    <div className="shrink-0 w-full sm:w-auto flex justify-start sm:justify-center">
                                        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg text-slate-900 font-bold text-xl ring-4 ring-slate-700">3</div>
                                    </div>
                                    <h3 className="text-2xl font-bold ml-5 text-cyan-300 mt-2 sm:mt-0">Phase 3: Finalization and Presentation</h3>
                                </div>
                                <div className="sm:ml-16 space-y-4 border-l-2 sm:border-l-0 border-cyan-400 pl-4 sm:pl-0 pt-2">
                                    {/* Step 7 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Eye className="w-4 h-4 mr-2 text-green-400" /> 7. Review and Get Feedback
                                        </h4>
                                        <p className="text-sm text-gray-300">Proofread. Test run a mini-version with a colleague. Check for clarity on the main idea and next steps.</p>
                                    </div>
                                    {/* Step 8 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Printer className="w-4 h-4 mr-2 text-green-400" /> 8. Print/Prepare the Final Poster
                                        </h4>
                                        <p className="text-sm text-gray-300">Use a high-quality large-format printer (or ensure digital file meets resolution/format requirements).</p>
                                    </div>
                                    {/* Step 9 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Mic className="w-4 h-4 mr-2 text-green-400" /> 9. Prepare Your Presentation Pitch
                                        </h4>
                                        <p className="text-sm text-gray-300">Practice your 30-second &quot;Elevator Pitch&quot; and your 2-3 minute &quot;Full Pitch.&quot;</p>
                                    </div>
                                    {/* Step 10 */}
                                    <div className="p-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                                        <h4 className="font-semibold flex items-center mb-1">
                                            <Handshake className="w-4 h-4 mr-2 text-green-400" /> 10. Present and Network
                                        </h4>
                                        <p className="text-sm text-gray-300">Dress professionally, be enthusiastic, greet visitors warmly, and take notes on the feedback you receive!</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </section>

                    {/* Footer Call to Action */}
                    <footer className="mt-12 text-center p-6 bg-slate-800 rounded-xl shadow-lg border-t-2 border-cyan-400">
                        <h3 className="text-xl font-semibold text-white mb-2">Ready to Design Your Poster?</h3>
                        <p className="text-gray-300">Focus on making the &quot;Proposed Idea/Methodology&quot; and &quot;Future Work&quot; sections crystal clear.</p>
                    </footer>

                </div>
            </div>
        </>
    );
}
