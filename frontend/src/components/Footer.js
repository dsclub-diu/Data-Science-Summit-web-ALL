export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-black/50">
      <div className="w-full mx-auto px-4 md:px-38 py-5">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Left Section - Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-600 dark:text-gray-300 text-sm md:text-base font-medium">
              Copyright © {currentYear}
            </p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm md:text-base">
              <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
              <span>Data Science Lab, Daffodil International University</span>
            </div>
          </div>

          {/* Right Section - Links/Branding */}
          <div className="flex items-center gap-6 md:gap-8">
            <a
              href="#"
              className="text-slate-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 text-sm md:text-base font-medium"
            >
              About
            </a>
            <div className="w-px h-5 bg-slate-300 dark:bg-gray-700"></div>
            <a
              href="#"
              className="text-slate-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 text-sm md:text-base font-medium"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-cyan-400 via-opacity-30 to-transparent mb-5"></div>

        {/* Developer Info */}
        <div className="flex flex-col items-center">
          <p className="text-slate-500 dark:text-gray-400 text-xs md:text-sm font-medium">
            Design & Developed by @ <a href="https://www.linkedin.com/in/khandakersaminyeasar/" target="_blank" className="text-blue-600 dark:text-blue-200 ">Khandaker Samin Yeasar</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
