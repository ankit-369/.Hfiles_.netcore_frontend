'use client';
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface HomeProps {
  children: React.ReactNode;
}

const Home: React.FC<HomeProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main
        className={`flex-grow transition duration-300 ${
          isMenuOpen ? 'blur-sm pointer-events-none' : ''
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <footer
        className={`sticky bottom-0 transition duration-300 ${
          isMenuOpen ? 'blur-sm pointer-events-none' : ''
        }`}
      >
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
