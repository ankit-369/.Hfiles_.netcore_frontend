'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div>
      <header className="header">
        <Image
          src="https://hfiles.in/wp-content/uploads/2022/11/hfiles.png"
          alt="hfiles logo"
          width={150}
          height={60}
        />

        {/* Sign In Button (Top Right) */}
        <Link href="/login.aspx">
          <div className="signup" style={{ visibility: 'hidden' }}>
            <p>Sign In</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <a href="#about_us_section" className="aboutus">
                About us
              </a>
            </li>
            <li>
         
          <Link href="/articles">Article</Link>
            </li>
            <li>
              <Link href="/login">
                <div className="signup">
                  <p>Sign In</p>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
