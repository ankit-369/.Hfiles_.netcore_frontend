'use client';
import React from 'react';
import Image from 'next/image';

export default function Recognized() {
  return (
    <section className="recognized-section">
      <div className="main-recognized">

        {/* Left: Recognized Under */} 
        <div className="image-wrapper1">
          <h3>Recognized Under</h3>
          <div className="image-container">
            <Image  style={{height:'auto'}}
              src="/journal-page-images/article/Recognized.jpeg"
              alt="Recognized"
              width={120}
              height={40}
            />
          </div>
        </div>

        {/* Right: Active Integrator */}
        <div className="image-wrapper2">
          <h3>Active Integrator</h3>
          <div className="image-flex">
            <div className="image-container">
              <Image  style={{height:'auto'}}
                src="/journal-page-images/article/Active.jpeg"
                alt="Active Integrator Logo 1"
                width={80}
                height={40}
              />
            </div>
            <div className="image-container">
              <Image  style={{height:'auto'}}
                src="/journal-page-images/article/Active2.jpeg"
                alt="Active Integrator Logo 2"
                width={80}
                height={40}
              />
            </div>
          </div>
        </div>
        
      </div>

      <style jsx>{`
        .recognized-section {
          background-color: #0331b5;
          padding: 0.5rem 0;
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        .main-recognized {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          width: 100%;
        }

        .image-wrapper1,
        .image-wrapper2 {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        h3 {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          text-align: center;
          white-space: nowrap;
        }

        .image-container {
          background: white;
          border-radius: 6px;
          padding: 0.4rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          min-width: 100px;
        }

        .image-flex {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .recognized-section {
            padding: 0.4rem 0;
          }

          .main-recognized {
            flex-direction: column;
            gap: 0.8rem;
            padding: 0 1rem;
          }

          .image-wrapper1,
          .image-wrapper2 {
            width: 100%;
            gap: 0.2rem;
          }

          h3 {
            font-size: 0.9rem;
          }

          .image-flex {
            justify-content: center;
            gap: 0.4rem;
          }

          .image-container {
            min-width: 80px;
            min-height: 40px;
            padding: 0.3rem;
          }
        }

        @media (max-width: 480px) {
          .recognized-section {
            padding: 0.3rem 0;
          }

          .image-container {
            min-width: 70px;
            min-height: 35px;
            padding: 0.25rem;
          }

          h3 {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}