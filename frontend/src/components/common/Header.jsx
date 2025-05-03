import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  Search,
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import { navLinks } from "./Heder.config";
import ThemeToggle from "./ThemeToggle";
import image from "../../assets/Asset 11.png";
import { useSelector } from "react-redux";
import { Modal } from "../modal/Modal";
import { useLogout } from "../../app/queries/useAllCountries";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserData, setShowUserData] = useState(false);
  const logout = useLogout();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.user);

  console.log("userData", userData);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <header
      className={`font-serif fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-neutral dark:bg-dark backdrop-blur-sm shadow-md"
          : "py-6 bg-neutral dark:bg-dark"
      } text-dark_hover dark:text-gray-200`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={image} className="h-[30px]" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-200">
              TAZA
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.hasDropdown && toggleDropdown(link.name)
                }
                onMouseLeave={closeDropdowns}
              >
                {link.hasDropdown ? (
                  <button
                    className="flex items-center px-3 py-2 font-medium hover:text-primary  transition-colors duration-200"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.name}
                    <ChevronDown size={16} className="ml-1 mt-1" />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className="px-3 py-2  font-medium hover:text-primary  transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                )}

                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark_hover rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                    <div className="py-1">
                      {link.dropdownContent?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-light_hover dark:hover:bg-dark_hover"
                          onClick={closeDropdowns}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <button className="font-inter p-2 font-bold text-danger rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors">
                  <Link to="/live">Live</Link>
                </button>
                <Link
                  className="p-2 rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors"
                  to={"/search"}
                >
                  <Search size={20} />
                </Link>

                <div className="relative">
                  <button
                    //onClick={() => toggleDropdown(userRole)}
                    className="p-2 rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors"
                    onClick={() => setShowUserData(!showUserData)}
                  >
                    <User size={20} />
                  </button>
                </div>
              </div>
            )}

            <ThemeToggle />

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary"
              >
                {" "}
                <LogIn size={18} />
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              <LogIn size={18} />
              Login
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-light_hover dark:hover:bg-dark_hover transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } transition-all duration-300`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t dark:border-dark_hover">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className="w-full text-left flex justify-between items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === link.name && (
                    <div className="pl-4 space-y-1 animate-slideDown">
                      {link.dropdownContent?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-light_hover dark:hover:bg-dark_hover"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link.path}
                  className="block px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-dark_hover">
            <Link
              to="/account"
              className="flex items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} className="mr-2" />
              My Account
            </Link>
            <Link
              to="/search"
              className="flex items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} className="mr-2" />
              Search
            </Link>
          </div>
        </div>
      </div>

      {!!userData && (
        <Modal isOpen={showUserData} onClose={() => setShowUserData(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 text-primary dark:text-white">
              User Details
            </h2>
            <p className="text-md text-dark dark:text-white">
              Name: {userData.name}
            </p>
            <p className="text-md text-dark dark:text-white">
              Email: {userData.email}
            </p>
            <p className="text-md text-dark dark:text-white">
              Phone: {userData.phone}
            </p>
          </div>
        </Modal>
      )}
    </header>
  );
};

export default Header;
