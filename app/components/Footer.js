import { Facebook, Linkedin, Github, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 text-blue-900 border-t border-blue-200 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="text-sm text-blue-700">
            © {currentYear}{" "}
            <span className="font-semibold tracking-tight text-indigo-700 font-sans">
              Over<span className="text-indigo-500 font-bold">Track</span>
            </span>
            . All rights reserved.
          </p>
          <p className="text-sm text-blue-700">
            Developed by Shaikh Tanveer Hossain
          </p>
        </div>

        <div className="flex space-x-6">
          <a
            href="https://www.facebook.com/stanveer.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook profile"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-300"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/metanveer/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-300"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/metanveer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-300"
          >
            <Github size={20} />
          </a>
          <a
            href="mailto:stanveer.me@gmail.com"
            aria-label="Email"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-300"
          >
            <Mail size={20} />
          </a>
        </div>

        <div className="hidden md:block">
          <a
            href="#"
            aria-label="Back to top"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-300"
          >
            <ArrowUp size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
