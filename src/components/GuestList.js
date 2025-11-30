import React from "react";
import Image from "next/image";

// Guest data
const guests = [
    {
        name: "Dr. Md. Sabur Khan",
        img: "/guests/sabur-khan.png",
        designation: "Honorable Chairman Board of Trustees",
        organization: "Daffodil International University",
        category: "chairman",
    },
    {
        name: "Professor Dr. M. R. Kabir",
        img: "/guests/vc.png",
        designation: "Vice Chancellor",
        organization: "Daffodil International University",
        category: "chief",
    },
    {
        name: "Professor Mohammed Masum Iqbal, PhD",
        img: "/guests/pro-vc.png",
        designation: "Pro Vice Chancellor",
        organization: "Daffodil International University",
        category: "chief",
    },
    {
        name: "Professor Dr. Md. Fokhray Hossain",
        img: "/guests/dean.png",
        designation: "Dean and Professor of FSIT",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Prof. Dr. Bimal Chandra Das",
        img: "/guests/as-dean.png",
        designation: "Associate Dean and Professor of FSIT",
        organization: "Daffodil International University",
        category: "special",
    },

    {
        name: "Dr. Imran Mahmud",
        img: "/guests/head.png",
        designation: "Head of Software Engineering Department",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Ms. Nusrat Jahan",
        img: "/guests/nusrat.png",
        designation: "Head of Information Technology Management (ITM) Department",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Dr. Md. Fazla Elahe",
        img: "/guests/fazla-elahe.png",
        designation: "Associate Head of Software Engineering Department",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Dr. Abdus Sattar",
        img: "/guests/abdus-sattar.png",
        designation: "Associate Professor & Director, M.Sc in CSE",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Mr. Md. Khaled Sohel",
        img: "/guests/sohel.png",
        designation: "Assistant Professor of Software Engineering Department",
        organization: "Daffodil International University",
        category: "special",
    },
    {
        name: "Nuruzzaman Faruqui",
        img: "/guests/nuruzzaman.png",
        designation: "Assistant Professor of Software Engineering Department",
        organization: "Daffodil International University",
        category: "special",
    },

    // Keynote Speaker
    {
        name: "Sadman Araf",
        img: "/guests/sadman-araf.png",
        designation: "Data Scientist",
        organization: "Grameenphone Ltd",
        category: "speaker",
    },
    {
        name: "Abdullah Al Hasan",
        img: "/guests/abdullah-al-hasan.png",
        designation: "Founder & Chief Executive Officer",
        organization: "Muslims Day",
        category: "speaker"
    },
    {
        name: "Sakhawat Hossain",
        img: "/guests/sakhawat-hossain.png",
        designation: "Senior Software Engineer",
        organization: "Cefalo",
        category: "speaker"
    },
    {
        name: "Syed Refat Al Abrar",
        img: "/guests/refat-al-abrar.png",
        designation: "Staff Consultant",
        organization: "Cefalo",
        category: "speaker"
    }


    // {
    //     name: "Dr. Mohammad NuruzZaman",
    //     img: "/guests/ceosir.jpg",
    //     designation: "Group CEO",
    //     organization: "Daffodil Family",
    //     category: "special",
    // }
];

const GuestCard = ({ guest }) => {
    const { name, img, designation, organization } = guest;

    return (
        <div className="group relative w-80 rounded-2xl border border-gray-700/50 bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 flex flex-col">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Image Section */}
            <div className="relative p-6 pb-4 flex justify-center">
                <div className="relative">
                    <Image
                        src={img}
                        width={280}
                        height={280}
                        alt={name}
                        className="w-56 h-56 object-cover rounded-xl border-2 border-gray-700/30 group-hover:border-cyan-500/50 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Content Section - Fixed Height */}
            <div className="relative p-6 pt-2 flex flex-col justify-between flex-1 text-center min-h-[140px]">
                {/* Name - Fixed height with line clamping */}
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2 leading-tight min-h-14">
                        {name}
                    </h3>
                </div>

                {/* Designation and Organization */}
                <div className="space-y-1">
                    <p className="text-sm text-cyan-400 font-medium leading-relaxed">
                        {designation}
                    </p>
                    <p className="text-sm text-gray-300 italic">
                        {organization}
                    </p>
                </div>
            </div>
        </div>
    );
};

const GuestList = () => {
    const chairman = guests.filter((guest) => guest.category === "chairman");
    const chiefGuests = guests.filter((guest) => guest.category === "chief");
    const specialGuests = guests.filter((guest) => guest.category === "special");
    const speakers = guests.filter((guest) => guest.category === "speaker");
    // const regularGuests = guests.filter((guest) => guest.category === "guest");

    return (
        <section
            id="guests"
            className="w-full py-24 md:py-32 px-4 relative z-10 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950"
        >
            <div className="max-w-7xl mx-auto">
                {/* Main Title */}
                <div className="text-center mb-20 md:mb-24">
                    <div className="inline-block mb-6">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-xl opacity-30"></div>
                            <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Guests
                            </h2>
                        </div>
                    </div>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        Meet our distinguished guests and speakers who will share their expertise and insights
                    </p>
                </div>

                {/* Chairman Section */}
                {chairman.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Honour of Guest
                        </h3>
                        <div className="flex justify-center gap-8">
                            {chairman.map((guest) => (
                                <GuestCard key={guest.name} guest={guest} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Chief Guests Section */}
                {chiefGuests.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Chief Guests
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            {chiefGuests.map((guest) => (
                                <GuestCard key={guest.name} guest={guest} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Special Guests Section */}
                {specialGuests.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Special Guests
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            {specialGuests.map((guest) => (
                                <GuestCard key={guest.name} guest={guest} />
                            ))}
                        </div>
                    </div>
                )}
                {speakers.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Special Guest from Industry
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            {speakers.map((guest) => (
                                <GuestCard key={guest.name} guest={guest} />
                            ))}
                        </div>
                    </div>
                )}

                {/* <div className="mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Guests
                    </h3>
                    <div className="flex flex-wrap justify-center gap-8">
                        {regularGuests.map((guest) => (
                            <GuestCard key={guest.name} guest={guest} />
                        ))}
                    </div>
                </div> */}
            </div>
        </section>
    );
};

export default GuestList;
