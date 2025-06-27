'use client'
import React, { useEffect, useState } from 'react';
import { Mail, Shield, Eye, EyeOff } from 'lucide-react';
import DynamicPage from '../components/Header&Footer/DynamicPage';
import { toast, ToastContainer } from 'react-toastify';
import { InviteMember, InviteOTPs, InvitePassword } from '../services/HfilesServiceApi';
import { encryptData } from '../utils/webCrypto';
import { useRouter } from 'next/navigation';

const HealthFilesAuth = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
    const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get('email');
    if (emailFromUrl) {
      setOldEmail(emailFromUrl);
      setEmail(emailFromUrl);
    }
  }, []);

 const handleEmailSubmit = async () => {
  if (email && termsAccepted) {
    const payload = {
      oldEmail: oldEmail,
      newEmail: email,
      termsAndConditions: termsAccepted,
    };
    try {
      const response = await InviteMember(payload);
      toast.success(`${response.data.message}`);
      setStep(2);
    } catch (error: any) {
      console.error('Error submitting email:', error);
    }
  } 
};


  const handleOtpChange = (index: number, value: string | any) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

 const handleOtpSubmit = async () => {
  if (otp.every(digit => digit !== '')) {
    const otpValue = otp.join('');
    const payload = {
      email: email,
      otp: otpValue,
    };

    try {
      const response = await InviteOTPs(payload);
      toast.success(`${response.data.message}`);
      setStep(3);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
    }
  } else {
    toast.warn('Please enter all 6 digits of the OTP.');
  }
};


 const handlePasswordSubmit = async () => {
  const payload = {
    email: email,
    password: password,
  };

  try {
    const response = await InvitePassword(payload);
        const token = response?.data?.data?.token;

    // Decode JWT token to extract `sub` and `UserId`
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const data = JSON.parse(jsonPayload);
    localStorage.setItem("authToken", await encryptData(token));
    localStorage.setItem("sub", await encryptData(data.sub));
    localStorage.setItem("userId", await encryptData(data.UserId));
    localStorage.setItem("userName", await (response.data.data.username));
    localStorage.setItem("isEmailVerified", await (response.data.data.isEmailVerified));
    localStorage.setItem("isPhoneVerified", await (response.data.data.isPhoneVerified));

    toast.success(`${response.data.message}`);
    router.push('/addbasicdetails');
  } catch (error: any) {
    console.error('Error setting password:', error);
  }
};


  const resendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    alert('OTP resent!');
  };

  return (
    <DynamicPage>
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-100 flex items-center justify-center flex-col md:flex-row w-full h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-139px)] 2xl:h-[calc(100vh-140px)]">
        <div className="w-full min-w-7xl flex items-center justify-between mx-4">

          {/* Left Side - Illustration and Title */}
          <div className="flex-1 max-w-md">
            <h1 className="text-4xl font-bold text-blue-800 mb-8 mx-2 leading-tight">
              Get Smart With<br />Your Health
            </h1>

            <div className="flex justify-center">
              <img
                src="/32b081e3d2fdc6f81300133dcf1d61a309d325c3.png"
                alt="Health Files Illustration"
                className="min-w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 min-w-md ml-12">
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src="c58406b5f7677a1dfe6229727edf59accdc4b368.png"
                      alt="Health Files Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  Welcome to Health Files!
                </h2>
                <p className="text-gray-600 mb-8">
                  Let's simplify your healthcare.
                </p>
              </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I Accept The <span className="text-blue-600 underline cursor-pointer">Privacy & Policy</span> And <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span>
                  </label>
                </div>

                <button
                  onClick={handleEmailSubmit}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Verify
                </button>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
                  </p>
                  <div className="flex space-x-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={resendOtp}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  onClick={handleOtpSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Login
                </button>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Create a secure password for your account
                  </p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ?  <Eye className="w-5 h-5" /> :  <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </DynamicPage>
  );
};

export default HealthFilesAuth;
