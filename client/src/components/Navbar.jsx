import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/selloraLogo.jpg";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50
      transition-transform duration-300
      ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex justify-between items-center p-4 bg-transparent backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={logo} alt="logo" className="rounded-full w-10 h-10 rotate-20 ring-1 ring-offset-2 ring-offset-orange-300 hover:ring-offset-orange-500" />
          </Link>
          <Link to="/" className="text-2xl font-semibold">
            Sellora
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            to="/signup"
            className="text-2xl font-bold rounded-md p-2 hover:ring-1 transition-all duration-300"
          >
            SignUp
          </Link>
          <Link
            to="/login"
            className="text-2xl font-bold rounded-md p-2 hover:ring-1 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
