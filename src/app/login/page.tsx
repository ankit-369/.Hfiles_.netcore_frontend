'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Home from "../components/Home";
import { Login ,otplogin} from '../services/HfilesServiceApi';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'OTP' | 'password'>('OTP');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    otp: '',
    contactType: 'Email'
  });
  const [timer, setTimer] = useState(0);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  const router = useRouter();

  // Responsive padding logic
  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrLarger(window.innerWidth >= 768);
    };
    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer effect for OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && loginMode === 'OTP') {
      setShowResendOtp(true);
    }
  }, [timer, loginMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));

  // optionally trigger OTP logic
  if (name === 'emailOrPhone' && value.length >= 10) {
    await handleGetOtp(); // risky: could trigger too many calls while typing
  }
};

const handleGetOtp = async () => {
  const otppayload = {
    ContactOrEmail: formData.emailOrPhone,
    SelectedCountryCode: null,
  };

  try {
    const response = await otplogin(otppayload);
    console.log("OTP Sent Successfully:", response.data);

    // ✅ Switch UI to OTP input mode
    setLoginMode("OTP");

    // ✅ Start timer
    setTimer(60);
    setShowResendOtp(false);

  } catch (error) {
    console.error("OTP Send Error:", error);
  }
};

  // const handleGetOtp = async() => {
  
  //  const otppayload = {
  //     ContactOrEmail: formData.emailOrPhone,
  //     SelectedCountryCode: null
  //   };
  //   try {
  //     const response = await otplogin(otppayload);
  //     //router.push("/Dashboard");
  //     console.log('Login Success:', response.data);

  //     // Add further logic: save token, redirect, etc.
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     // Show error to user (optional)
  //   }
  //   console.log('OTP login:', formData);
  //   // handle OTP login logic
  // }
  
  

  // const handleLogin = () => {
  //   if (loginMode === 'password') {
  //     console.log('Password login:', formData);

  //     // Login(formData)
  //   } else {
  //     console.log('OTP login:', formData);
  //   }
  // };
const handleLogin = async () => {
  if (loginMode === 'password') {
    const payload = {
      Username: formData.emailOrPhone,
      Password: formData.password
    };

    console.log('Login Payload:', payload);

    try {
      const response = await Login(payload);
      router.push("/Dashboard");
      console.log('Login Success:', response.data);

      // Add further logic: save token, redirect, etc.
    } catch (error) {
      console.error('Login Error:', error);
      // Show error to user (optional)
    }

  } else {
    console.log('OTP login:', formData);
    
  }
};



  const handleResendOtp = () => {
    setTimer(60);
    setShowResendOtp(false);
    console.log('Resending OTP');
  };

  const toggleLoginMode = () => {
    setLoginMode(prev => (prev === 'password' ? 'OTP' : 'password'));
  };

  return (
    <Home>
      <div className="flex flex-col">
        {/* Main Content */}
        <div className="flex flex-1 w-screen bg-gray-100" style={{
    marginLeft: "-341px",
    marginInlineEnd: "auto"
  }}>
          {/* Left Side - Image */}
          <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center">
            <img
              src="/assets/login-samanta-w-bg.png"
              alt="Hfiles"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>

          {/* Right Side - Login Form */}
          <div
            className="w-full lg:w-1/2 flex justify-center bg-[#002FA7]"
            style={{ paddingTop: isTabletOrLarger ? '192px' : '0px' }}
          >
            <div className="w-full max-w-md px-4">
              {/* Logo and Welcome */}
              <div className="text-center mb-8">
                <img
                  src="/Sign Up Page/Hfiles Logo.png"
                  alt="Hfiles Logo"
                  className="w-32 mx-auto mb-4"
                />
                <h1 className="text-white text-3xl font-bold">Welcome Back!</h1>
              </div>

              {/* Email/Phone Input */}
              <div className="mb-6">
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  placeholder="Email Id / Contact No."
                  className="w-full px-6 py-3 rounded-full border-none outline-none bg-white"
                  required
                />
              </div>

              {/* Password Input */}
              {loginMode === 'password' && (
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full px-6 py-3 rounded-full border-none outline-none pr-12 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <a href="/forgot-password" className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold">
                      Forgot Password?
                    </a>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              {loginMode === 'OTP' && timer > 0 && (
                <div className="mb-6">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="w-full px-6 py-3 rounded-full border-none outline-none bg-white"
                    required
                  />
                  <div className="text-right mt-2 text-white text-sm">
                    {timer > 0 && (
                      <span>Time remaining: {formatTime(timer)}</span>
                    )}
                    {showResendOtp && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold ml-4"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Get OTP Button */}
              {loginMode === 'OTP' && timer === 0 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    GET OTP
                  </button>
                </div>
              )}

              {/* Login Button */}
              {(loginMode === 'password' || (loginMode === 'OTP' && timer > 0)) && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Login
                  </button>
                </div>
              )}

              {/* Or Divider */}
              <div className="text-center mb-6">
                <span className="text-white">Or</span>
              </div>

              {/* Toggle Login Mode */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={toggleLoginMode}
                  className="w-full bg-transparent border-2 border-yellow-400 text-yellow-400 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-white">
                  New User? Click{' '}
                  <a href="/signUp" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                    here
                  </a>{' '}
                  to Sign Up
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </Home>
  );
}
