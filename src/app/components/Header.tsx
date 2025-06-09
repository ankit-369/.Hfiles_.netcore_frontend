"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0331B5] text-white px-4 py-3 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://hfiles.in/wp-content/uploads/2022/11/hfiles.png"
            alt="HFiles Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6 items-center text-sm sm:text-base font-bold">
          <div className="hover:underline cursor-pointer">About Us</div>
          <div className="hover:underline cursor-pointer">Article</div>
          <button
            className="bg-yellow-400 text-blue-700 px-4 py-2 rounded hover:bg-yellow-300 transition"
            onClick={handleSignIn}
          >
            Sign Up
          </button>
        </nav>
      </div>

      {/* Sidebar Drawer - Mobile Only */}
      <div
  className={`fixed top-0 left-0 h-full w-full bg-white text-blue-800 z-50 shadow-lg transform transition-transform duration-300 ${
    isMenuOpen ? "translate-x-0" : "-translate-x-full"
  } sm:hidden`}
>
  <div className="flex justify-between items-center p-4 border-b border-gray-200">
    <h2 className="text-lg font-bold">Menu</h2>
    <button onClick={() => setIsMenuOpen(false)}>
      <X size={24} />
    </button>
  </div>
  <div className="flex flex-col p-4 gap-4 font-semibold">
    <div className="cursor-pointer hover:underline">About Us</div>
    <div className="cursor-pointer hover:underline">Article</div>
    <button
      className="bg-yellow-400 text-blue-700 px-4 py-2 rounded hover:bg-yellow-300 w-fit"
      onClick={() => {
        setIsMenuOpen(false);
        handleSignIn();
      }}
    >
      Sign Up
    </button>
  </div>
</div>


      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
