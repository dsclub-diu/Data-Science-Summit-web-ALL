import { MapPin, Clock } from 'lucide-react';

export default function VenueSection() {
     return (
          <section className="w-full py-24 md:py-32 px-4 relative z-10 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
               <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20 md:mb-24">
                         <div className="inline-block mb-6">
                              <div className="relative">
                                   <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
                                   <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                        Venue
                                   </h2>
                              </div>
                         </div>
                         <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                              Join us at Daffodil International University, Daffodil Smart City for the 5th National Data Science Summit 2026.
                         </p>
                    </div>

                    {/* Venue Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                         {/* Left Side - Map */}
                         <div className="rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                              <iframe
                                   title="Daffodil International University Map"
                                   width="100%"
                                   height="450"
                                   style={{ border: 0 }}
                                   loading="lazy"
                                   referrerPolicy="no-referrer-when-downgrade"
                                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.5234567890123!2d90.3201592!3d23.8768956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ada2664e21:0x3c872fd17bc11ddb!2sDaffodil%20International%20University%2C%20Daffodil%20Smart%20City%2C%20Birulia!5e0!3m2!1sen!2sbd!4v1735550000000"
                                   allowFullScreen=""
                              ></iframe>
                         </div>

                         {/* Right Side - Event Details */}
                         <div className="space-y-6">
                              <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                                   {/* Date Card */}
                                   <div className=" bg rounded-2xl p-1 w-full  md:min-h-44 md:w-5/6 bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-cyan-500/20">
                                        <div className=" rounded-xl p-6">
                                             <div className="flex items-start gap-4">
                                                  <div className="shrink-0">
                                                       
                                                  </div>
                                                  <div className="flex-1">
                                                       <h3 className="text-lg font-bold text-white mb-3">
                                                            July 12, 2026
                                                       </h3>
                                                       <p className="text-gray-300 font-semibold flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            Sunday 9AM - 5PM
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Location Card */}
                                   <div className="bg-linear-to-br h-full w-full from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-1">
                                        <div className=" rounded-xl p-6">
                                             <div className="flex items-start gap-4">
                                                  
                                                  <div className="flex-1">
                                                       <h3 className="text-lg font-bold text-white mb-3">
                                                            Location
                                                       </h3>
                                                       <p className="text-gray-300 font-semibold leading-relaxed">
                                                            Daffodil Smart City,<br />
                                                            Ashulia, Dhaka.
                                                       </p>
                                                       <p className="text-sm text-gray-300 mt-2">
                                                            Birulia, Savar, Dhaka-1216, Bangladesh
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>



                              {/* Additional Info */}
                              <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
                                   <h3 className="text-lg font-bold text-white mb-4">Quick Info</h3>
                                   <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-3">
                                             <span className="text-cyan-400 font-bold">•</span>
                                             <span>5th National Data Science Summit 2026</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <span className="text-cyan-400 font-bold">•</span>
                                             <span>Hosted by Data Science Lab & Department of Software Engineering</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <span className="text-cyan-400 font-bold">•</span>
                                             <span>Daffodil International University</span>
                                        </li>
                                   </ul>
                              </div>


                         </div>
                    </div>
               </div>
          </section>
     );
}