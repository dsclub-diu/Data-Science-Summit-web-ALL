import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

// Load Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
});

export const metadata = {
  title: "5th National Data Science Summit 2026 | AI in Entrepreneurship",
  description:
    "5th National Data Science Summit 2026 — theme: AI in Entrepreneurship. ৳80,000 total prize pool. Join us July 12, 2026 at Daffodil Smart City, Birulia, Savar, Dhaka for hackathons, project showcases, and expert sessions.",
  keywords: ["Data Science", "AI", "AI in Entrepreneurship", "Machine Learning", "Deep Learning", "Big Data", "Analytics", "Daffodil International University", "Data Science Summit 2026", "National Data Science Summit", "Dhaka", "Bangladesh", "Tech Event Dhaka", "DIU", "DS Club", "DIU DS Club", "80000 prize pool"],
};

// Runs before paint to prevent a theme flash. Default = dark.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('dss-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/image.png" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${poppins.variable} antialiased min-h-screen w-full relative`}
      >
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
