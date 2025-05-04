import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import image from "../../assets/Asset 11.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <footer className="font-serif bg-white dark:bg-gray-900 text-dark_hover dark:text-gray-200 transition-colors duration-300 pt-12 pb-6 border-t border-gray-200 dark:border-dark_hover">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col justify-around item-left md:flex-row lg:flex-row gap-14 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img src={image} className="h-[30px]" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-200">
                TAZA
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Search Your Favorite Travel Destination with knowledgeable and
              experienced travel guides.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-row md:gap-6 lg:gap-16 gap-8">
            <div>
              <h3 className="text-md font-semibold mb-4">Quick links</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <a
                    href="/"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Live World
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Countries
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-4">Features</h3>
              <ul className="text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Popular Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Flags
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Region
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div>
              <h3 className="text-lg font-semibold mb-4">News letter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Subscribe for get special updates
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-l outline-none bg-light_hover dark:bg-dark_hover border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-primary dark:focus:ring-orange-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-r font-medium bg-primary dark:bg-accent hover:bg-primary/50 dark:hover:bg-accent/50 text-white transition-colors "
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
            <div>
              <h3 className="text-md font-semibold my-4">Contact Us</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-4">
                <li className="flex items-start text-sm">
                  <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                  <span>123 Delivery Street, Foodville, CA 90210</span>
                </li>
                <li className="flex items-center text-sm">
                  <Phone size={18} className="mr-2 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center text-sm">
                  <Mail size={18} className="mr-2 flex-shrink-0" />
                  <span>support@taza.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark_hover mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 TAZA. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
