import React, { useState, useEffect, use } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const [animationActive, setAnimationActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const triggerAnimation = () => {
    setAnimationActive(true);
    setTimeout(() => navigate("/"), 500);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    navigate("/");
  }, [countdown]);

  return (
    <div className="font-serif flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark text-white p-6">
      <div className="max-w-md w-full bg-white dark:bg-dark rounded-lg shadow-2xl p-8 border dark:border-slate-700 ">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
          <div className="h-1 w-16 bg-red-500 mx-auto mb-6"></div>
          <h2 className="font-inter text-2xl font-semibold mb-2 text-dark dark:text-white">
            Page Not Found
          </h2>
          <p className=" mb-6 text-dark dark:text-white">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-6">
          <div className="font-inter p-4 bg-primary/80 dark:bg-white rounded-md text-sm text-white dark:text-dark">
            <p>
              Redirecting to homepage in{" "}
              <span className="text-red-400 font-semibold">{countdown}</span>{" "}
              seconds...
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className={`flex items-center justify-center gap-2 bg-white dark:bg-dark hover:bg-primary/60 dark:hover:bg-white/90 hover:text-white dark:hover:text-black  text-dark dark:text-white py-3 px-6 rounded-md w-full transition-all ${
                animationActive ? "animate-pulse" : ""
              }`}
              onClick={triggerAnimation}
            >
              <Home size={18} />
              <span>Go Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-slate-400 text-sm text-center">
        <p>Lost? Try searching our site or check our sitemap.</p>
      </div>
    </div>
  );
}
