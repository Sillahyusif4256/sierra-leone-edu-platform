// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sierra Leone Education Platform</h3>
            <p className="text-gray-400 dark:text-gray-300">
              Empowering students and teachers across Sierra Leone with quality educational resources.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300">
              <li><a href="/browse" className="hover:text-sl-green transition">Browse Resources</a></li>
              <li><a href="/about" className="hover:text-sl-green transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-sl-green transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 dark:text-gray-300">Freetown, Sierra Leone</p>
            <p className="text-gray-400 dark:text-gray-300">info@sl-edu.sl</p>
          </div>
        </div>
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-300">
          <p>&copy; 2026 Sierra Leone Education Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
