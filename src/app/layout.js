import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
});

export const metadata = {
  title: "5th National Data Science Summit 2025",
  description:
    "Join us for the 5th National Data Science Summit 2025 at Daffodil Smart City, Birulia, Savar, Dhaka. Explore the latest in AI and data science with industry experts and enthusiasts.",
  keywords: ["Data Science", "AI", "Machine Learning", "Deep Learning", "Big Data", "Analytics", "Daffodil International University", "Data Science Summit 2025", "National Data Science Summit", "Dhaka", "Bangladesh", "Tech Event Dhaka", "DIU", "DS Club", "DIU DS Club"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/image.png" type="image/png" />
      </head>
      <body
        className={`${poppins.variable} antialiased min-h-screen w-full bg-[#020617] relative`}
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
          backgroundAttachment: "fixed",
        }}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
