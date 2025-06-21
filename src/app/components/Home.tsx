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
        className={`transition duration-300 ${
          isMenuOpen ? 'blur-sm pointer-events-none' : ''
        } `}
      >
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>

        <Footer />
    </div>
  );
};

export default Home;
