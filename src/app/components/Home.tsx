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
    <div className="flex flex-col h-screen">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main
        className={`flex-grow transition duration-300 px-4 md:px-6 lg:px-8 py-6 ${
          isMenuOpen ? 'blur-sm pointer-events-none' : ''
        } overflow-y-auto`}
      >
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

        <Footer />
    </div>
  );
};

export default Home;
