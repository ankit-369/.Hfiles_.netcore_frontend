'use client';

import React, { useState } from 'react';
import MasterHeader from './MasterHeader';
import Footer from './Footer';

interface HomeProps {
  children: React.ReactNode;
}

const MasterHome: React.FC<HomeProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative">
      <MasterHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main
        className={`flex-grow transition duration-300 ${
          isMenuOpen ? 'blur-sm pointer-events-none' : ''
        }`}
      >
        <div className="mx-auto px-4 py-6">
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

export default MasterHome;
