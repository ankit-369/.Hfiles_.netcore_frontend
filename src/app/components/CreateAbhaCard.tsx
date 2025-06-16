// pages/CreateAbhaCard.js
import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/LandingPage/Header';
import Footer from '../components/LandingPage/Footer';

export default function CreateAbhaCard() {
  const [otpSent, setOtpSent] = useState(false);

  const handleGetOTP = () => {
    setOtpSent(true);
  };

  return (
    <>
    <Header/>
        <title>ABHA Card Registration | Hfiles</title>
        <meta name="description" content="Register for ABHA Card on Hfiles" />
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <style jsx>{`
          :root {
            --primary-color: #0331b5;
            --secondary-color: #cae5ff;
            --button-green: #238B02;
            --button-yellow: #ffd100;
            --text-hover-color: #323232;
          }

          * {
            font-family: 'Montserrat', sans-serif;
            box-sizing: border-box;
          }

          .poppins {
            font-family: 'Poppins', sans-serif;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }

          .bg-gradient {
            background: linear-gradient(
              to right,
              rgba(172, 237, 255, 0.7) 70%,
              rgba(255, 255, 255, 0.9) 80%,
              white 100%
            );
          }
        `}</style>
    

      {/* Header - Like in Image 2 */}
      <header className="text-white px-6 py-3 flex items-center justify-between" style={{backgroundColor: '#0331b5'}}>
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">
            <span style={{color: '#FFD700'}}>h</span>files
            <div className="text-xs" style={{color: '#ACEDFF', marginTop: '-5px'}}>HEALTH FILES</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-white hover:text-gray-200 transition">About us</a>
          <a href="#" className="text-white hover:text-gray-200 transition">Article</a>
          <button className="px-6 py-2 rounded-lg font-semibold transition" style={{backgroundColor: '#FFD700', color: '#000'}}>
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '40px 20px'}}>
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left: ABHA Card Image */}
            <div className="lg:w-2/5">
              <div className="bg-white rounded-2xl shadow-lg p-6" style={{maxWidth: '400px'}}>
                <img
                  src="/journal-page-images/article/abha_header_imag.png"
                  alt="ABHA Card"
                  className="w-full h-auto"
                  style={{maxHeight: '450px', objectFit: 'contain'}}
                />
              </div>
            </div>

            {/* Right: Registration Form */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                
                {/* Form Header */}
                <div className="text-white text-center py-4 text-xl font-semibold" style={{backgroundColor: '#4A6CF7'}}>
                  ABHA Card Registration
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6">
                  
                  {/* Aadhaar & OTP Row */}
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Enter Adhar Number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Get OTP Button */}
                  <button
                    onClick={handleGetOTP}
                    className="w-full py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
                    style={{backgroundColor: '#f1f5f9'}}
                  >
                    Get OTP
                  </button>

                  <hr className="border-gray-200" />

                  {/* Mobile & Verify Row */}
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Enter Mobile Number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      className="px-6 py-3 rounded-lg font-medium text-sm transition"
                      style={{backgroundColor: '#7DD3FC', color: '#0F172A'}}
                    >
                      Verify OTP & Generate ABHA
                    </button>
                  </div>

                  {/* Success Message */}
                  {otpSent && (
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <i className="fas fa-check-circle"></i>
                        <span className="text-sm font-medium">OTP Sent Successfully!</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <p className="text-lg text-gray-700 font-medium lg:text-left text-center">
                Stay ready with your digital health ID - one click to access your healthcare journey.
              </p>
              <button 
                className="px-8 py-3 rounded-lg font-semibold text-black transition hover:opacity-90"
                style={{backgroundColor: '#FEF08A', minWidth: '200px'}}
              >
                Download ABHA Card
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* What is ABHA Card Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left: Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6" style={{color: '#0331b5'}}>What is ABHA Card?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Ayushman Bharat Health Account (ABHA) Card is a part of India's Ayushman Bharat Digital Mission (ABDM). It serves as a digital health identity that enables individuals to securely store, manage, and share their medical records with healthcare providers.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With an ABHA Card, you can access your health records anytime, anywhere and share them with doctors, hospitals, and labs with your consent—ensuring seamless and efficient healthcare services.
              </p>
            </div>

            {/* Right: Card Image */}
            <div className="lg:w-1/2">
              <div className="bg-blue-600 rounded-2xl p-8 text-white relative">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/journal-page-images/article/Group 28.png" alt="NHA Logo" className="w-16 h-16" />
                  <div>
                    <div className="text-sm opacity-90">national</div>
                    <div className="text-sm opacity-90">health</div>
                    <div className="text-sm opacity-90">authority</div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-gray-200 rounded-lg p-4 text-black">
                    <div className="font-bold text-lg">John Doe</div>
                    <div className="text-sm text-gray-600 mt-1">ABHA number: XX-XXXX-XXXX-XXXX</div>
                    <div className="text-sm text-gray-600 mt-2">PHR Address: johndoe@abdm</div>
                    <div className="text-sm text-gray-600 mt-1">Date of Birth: 1/12/1993</div>
                  </div>
                </div>
                
                {/* QR Code placeholder */}
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded flex items-center justify-center">
                  <i className="fas fa-qrcode text-black text-2xl"></i>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What is ABHA Number Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left: Image */}
            <div className="lg:w-1/2">
              <img src="/journal-page-images/article/Group 18.png" alt="ABHA Number" className="w-full h-auto rounded-lg" />
            </div>

            {/* Right: Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6" style={{color: '#0331b5'}}>What is an ABHA Number?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                An ABHA Number is a 14-digit unique health ID assigned to every individual under the Ayushman Bharat Digital Mission. It acts as a personal health identity that links all your medical records and ensures a paperless, hassle-free healthcare experience.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With this number, you can securely share your health records with hospitals, clinics, and labs, eliminating the need to carry physical documents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{color: '#0331b5'}}>Benefits of ABHA Card</h2>
            <div className="w-24 h-1 mx-auto" style={{backgroundColor: '#0331b5'}}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Unique & Trustable Identity</h4>
                <p className="text-gray-700">Establish your presence in India's digital healthcare system.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Seamless Access to Medical Records</h4>
                <p className="text-gray-700">Store and manage all your health records digitally in one place.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Consent-Based Sharing</h4>
                <p className="text-gray-700">Securely share your health data with hospitals, labs, and doctors with your permission.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Hassle-Free Healthcare Experience</h4>
                <p className="text-gray-700">Avoid long queues and paperwork during hospital visits.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Linked to Public Health Benefits</h4>
                <p className="text-gray-700">Connect with government health programs and insurance schemes.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <i className="fas fa-check-circle text-2xl mt-1" style={{color: '#0331b5'}}></i>
              <div>
                <h4 className="font-semibold text-lg mb-2">Data Privacy & Security</h4>
                <p className="text-gray-700">Your health data is encrypted and shared only with your consent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}