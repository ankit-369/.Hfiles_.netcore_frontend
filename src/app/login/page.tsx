'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { listCounty, LoginOTp, LoginPassword, LoginWithOTPhahaha } from '../services/HfilesServiceApi';
import { useRouter } from 'next/navigation';
import DynamicPage from '../components/Header&Footer/DynamicPage';
import { toast, ToastContainer } from 'react-toastify';
import { encryptData, decryptData } from '../utils/webCrypto';

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'OTP' | 'password'>('OTP');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const router = useRouter();
  const [listCountyCode, setListCountryCode] = useState<any[]>([]);

  const isPhoneNumber = (value: string) => /^\d{10}$/.test(value);

  const ListCoutny = async () => {
    try {
      const response = await listCounty();
      setListCountryCode(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  useEffect(() => {
    ListCoutny();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && loginMode === 'OTP') {
      setShowResendOtp(true);
    }
  }, [timer, loginMode]);

  useEffect(() => {
    const getDecryptedTokenData = async () => {
      const encryptedToken = localStorage.getItem("authToken");
      if (encryptedToken) {
        try {
          const token = await decryptData(encryptedToken);
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const data = JSON.parse(jsonPayload);
          localStorage.setItem("sub", await encryptData(data.sub));
          localStorage.setItem("userId", await (data.UserId));
        } catch (error) {
          console.error("Failed to decode or decrypt token:", error);
        }
      } else {
        console.log("No authToken found in localStorage.");
      }
    };

    getDecryptedTokenData();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const validationSchema = Yup.object().shape({
    emailOrPhone: Yup.string()
      .required('Email or Phone is required')
      .matches(/^(\d{10}|\S+@\S+\.\S+)$/, 'Enter a valid 10-digit phone number or email'),
    password: loginMode === 'password'
      ? Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter')
        .matches(/\d/, 'Must contain at least one number')
        .matches(/[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,./~`]/, 'Must contain at least one special character')
      : Yup.string().notRequired(),
    otp: loginMode === 'OTP'
      ? Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits')
      : Yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      emailOrPhone: '',
      password: '',
      otp: '',
      countryCode: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loginMode === 'password') {
        const payload = {
          email: values.emailOrPhone,
          password: values.password,
        };
        try {
          const response = await LoginPassword(payload);
          toast.success(`${response.data.message}`);
          localStorage.setItem("userName", await (response.data.data.username));
          localStorage.setItem("isEmailVerified", await (response.data.data.isEmailVerified));
          localStorage.setItem("isPhoneVerified", await (response.data.data.isPhoneVerified));
          const token = response.data.data.token;

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
          router.push('/dashboard');
        } catch (error) {
          console.error('Login Error:', error);
          toast.error('Login failed. Please try again.');
        }
      } else {
        const input = values.emailOrPhone;
        const countryCode = values.countryCode;

        let payload;

        if (isPhoneNumber(input)) {
          payload = {
            Email: null,
            PhoneNumber: input,
            CountryCode: countryCode,
            Otp: values.otp
          };
        } else {
          payload = {
            Email: input,
            PhoneNumber: null,
            CountryCode: null,
            Otp: values.otp
          };
        }

        try {
          const response = await LoginWithOTPhahaha(payload);
          localStorage.setItem("userName", await (response.data.data.username));
          localStorage.setItem("isEmailVerified", await (response.data.data.isEmailVerified));
          localStorage.setItem("isPhoneVerified", await (response.data.data.isPhoneVerified));
          toast.success(`${response.data.message}`);
          const token = response.data.data.token;

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
          router.push('/dashboard');
        } catch (error) {
          console.error('OTP Login Error:', error);
          const err = error as any;
          toast.error(`${err.response.data.message}`);
        }
      }
    },
  });

  const handleGetOtp = async () => {
    const input = formik.values.emailOrPhone;
    const countryCode = formik.values.countryCode;

    let payload;

    if (isPhoneNumber(input)) {
      payload = {
        Email: null,
        PhoneNumber: input,
        CountryCode: countryCode
      };
    } else {
      payload = {
        Email: input,
        PhoneNumber: null,
        CountryCode: null
      };
    }

    try {
      await LoginOTp(payload);
      setTimer(60);
      setShowResendOtp(false);
      toast.success('OTP sent successfully');
    } catch (error) {
      console.error('OTP Send Error:', error);
      toast.error('Failed to send OTP');
    }
  };

  const toggleLoginMode = () => {
    setLoginMode(prev => (prev === 'password' ? 'OTP' : 'password'));
    formik.resetForm();
  };

  return (
    <DynamicPage>
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-90px)] lg:h-[calc(100vh-129px)] 2xl:h-[calc(100vh-140px)]">
        <div className="hidden md:flex flex-1 relative bg-gradient-to-b from-white via-white to-cyan-200 items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white rounded-l-[50%] md:rounded-l-[75%] lg:rounded-l-[100%]"></div>
          <div className="relative z-10 w-full max-w-[300px] md:max-w-[300px] lg:max-w-[400px] md:left-[-50px] lg:left-[-100px] xl:left-[-207px]    md:top-[30px] lg:top-[59px] text-center">
            {/* Heading Text */}
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-blue-800 leading-snug tracking-tight mb-2 md:mb-4">
              Get Smart With <br />
              <span>Your Health</span>
            </h2>
            {/* Assistant Illustration */}
            <img
              src="/32b081e3d2fdc6f81300133dcf1d61a309d325c3 (1).png"
              alt="Get Smart With Your Health"
              className="w-full h-auto object-contain drop-shadow-2xl transition-all duration-500 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8">
          <form onSubmit={formik.handleSubmit} className="w-full max-w-lg ">

            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
              <img
                src="/Sign Up Page/Hfiles Logo.png"
                alt="Hfiles Logo"
                className="w-20 sm:w-24 md:w-28 mx-auto mb-3 sm:mb-4"
              />
              <h1 className="text-blue-800 text-2xl sm:text-3xl font-bold mb-2">Welcome Back!</h1>
              {/* Centered border */}
              <div className="border-b-2 border-blue-800 w-16 sm:w-20 mx-auto"></div>
            </div>

            {/* Email/Phone Input with Country Code */}
            <div className="relative mb-4 sm:mb-6">
              <div className={`bg-white rounded-lg border overflow-hidden 
                              ${formik.touched.emailOrPhone && formik.errors.emailOrPhone ? 'border-red-500' : 'border-black'}
                              focus-within:ring-0 focus-within:outline-none`}>
                <div className="flex items-center">
                  {isPhoneNumber(formik.values.emailOrPhone) && (
                    <select
                      name="countryCode"
                      aria-label="Country Code"
                      value={formik.values.countryCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-16 sm:w-20 truncate border-0 bg-transparent py-2.5 sm:py-3 
                               pl-1.5 sm:pl-2 pr-0.5 sm:pr-1 text-xs sm:text-sm text-gray-700 
                               font-medium focus:outline-none focus:ring-0"
                    >
                      {Array.isArray(listCountyCode) &&
                        listCountyCode.map((country) => (
                          <option key={country.dialingCode} value={country.dialingCode}>
                            {country.country} {country.dialingCode}
                          </option>
                        ))}
                    </select>
                  )}

                  {/* Input field */}
                  <input
                    type="tel"
                    name="emailOrPhone"
                    placeholder="Email Id / Contact No."
                    value={formik.values.emailOrPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="flex-1 border-0 py-2.5 sm:py-3 px-2 bg-transparent text-gray-700 
                             text-sm sm:text-base focus:outline-none focus:ring-0 
                             placeholder:text-xs sm:placeholder:text-sm"
                  />
                </div>
              </div>

              {/* Error Message */}
              {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
                <div className="px-2 pt-1">
                  <p className="text-red-500 text-xs sm:text-sm">{formik.errors.emailOrPhone}</p>
                </div>
              )}
            </div>

            {/* Password Input */}
            {loginMode === 'password' && (
              <div className="mb-4 sm:mb-6">
                <div className="relative border border-black rounded-lg">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border-0 py-2.5 sm:py-3 px-2 bg-transparent text-gray-700 
                             text-sm sm:text-base focus:outline-none focus:ring-0 pr-12
                             placeholder:text-xs sm:placeholder:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.password}</p>
                )}
                <div className="text-right mt-2">
                  <a href="/forgot-password" className="text-blue-800 text-xs sm:text-sm font-semibold hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>
            )}

            {/* OTP Input */}
            {loginMode === 'OTP' && (
              <div className="mb-4 sm:mb-6">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white 
                  text-sm sm:text-base border 
                  ${formik.touched.otp && formik.errors.otp ? 'border-red-500' : 'border-black'}
                  outline-none focus:ring-0 placeholder:text-xs sm:placeholder:text-sm`}
                />

                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.otp}</p>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 
                              text-xs sm:text-sm text-black font-medium space-y-1 sm:space-y-0">
                  <span className="text-gray-700">Time remaining: {formatTime(timer)}</span>

                  {showResendOtp && (
                    <button
                      type="button"
                      onClick={handleGetOtp}
                      className="text-blue-800 font-semibold hover:underline text-left sm:text-right"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GET OTP Button */}
            {loginMode === 'OTP' && timer === 0 && (
              <div className="mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="w-full primary text-white py-2.5 sm:py-3 rounded-lg 
                           font-semibold cursor-pointer text-sm sm:text-base
                           hover:opacity-90 transition-opacity"
                >
                  GET OTP
                </button>
              </div>
            )}

            {/* Login Button */}
            {(loginMode === 'password' || (loginMode === 'OTP' && timer > 0)) && (
              <div className="mb-3 sm:mb-4">
                <button
                  type="submit"
                  className="w-full primary text-white py-2.5 sm:py-3 rounded-lg 
                           font-semibold hover:bg-yellow-300 text-sm sm:text-base
                           transition-colors"
                >
                  Login
                </button>
              </div>
            )}

            {/* OR Divider */}
            <div className="text-center mb-3 sm:mb-4">
              <span className="text-blue-800 font-bold text-sm sm:text-base">OR</span>
            </div>

            {/* Toggle Login Mode Button */}
            <div className="mb-4 sm:mb-6">
              <button
                type="button"
                onClick={toggleLoginMode}
                className="w-full border-2 border-black text-black py-2.5 sm:py-3 rounded-lg 
                         font-semibold bg-yellow-400 hover:text-black text-sm sm:text-base
                         transition-colors"
              >
                {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-black text-xs sm:text-sm">
                New User?{' '}
                <a href="/signUp" className="text-blue-800 font-semibold hover:underline">
                  Click here
                </a>{' '}
                to Sign Up
              </span>
            </div>
          </form>
        </div>

        <ToastContainer
          position="top-right"
          className="!text-xs sm:!text-sm"
          toastClassName="!text-xs sm:!text-sm"
        />
      </div>
    </DynamicPage>
  );
}