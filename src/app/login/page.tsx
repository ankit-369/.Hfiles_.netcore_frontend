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
      setListCountryCode(response?.data || []);
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
        // OTP Login Logic - Always send all 4 fields with conditional null values
        const input = values.emailOrPhone;
        const countryCode = values.countryCode;

        let payload;

        // Determine if input is phone number or email and construct payload with conditional nulls
        if (isPhoneNumber(input)) {
          // For phone number: Email = null, PhoneNumber = input, CountryCode = selected value, Otp = entered otp
          payload = {
            Email: null,
            PhoneNumber: input,
            CountryCode: countryCode,
            Otp: values.otp
          };
        } else {
          // For email: Email = input, PhoneNumber = null, CountryCode = null, Otp = entered otp
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

          // Decode and store token (same as password login)
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

    // Determine if input is phone number or email and construct payload with conditional nulls
    if (isPhoneNumber(input)) {
      // For phone number: Email = null, PhoneNumber = input, CountryCode = selected value
      payload = {
        Email: null,
        PhoneNumber: input,
        CountryCode: countryCode
      };
    } else {
      // For email: Email = input, PhoneNumber = null, CountryCode = null
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
      <div className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row bg-gray-100">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
          <img
            src="/assets/login-samanta-w-bg.png"
            alt="Hfiles"
            className="w-full max-w-[500px] h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center bg-[#002FA7] py-10">
          <form onSubmit={formik.handleSubmit} className="w-full max-w-md px-4">
            <div className="text-center mb-8">
              <img
                src="/Sign Up Page/Hfiles Logo.png"
                alt="Hfiles Logo"
                className="w-28 mx-auto mb-4"
              />
              <h1 className="text-white text-3xl font-bold">Welcome Back!</h1>
            </div>

            <div className="relative mb-6">
              <div
                className={`bg-white rounded-full border overflow-hidden 
      ${formik.touched.emailOrPhone && formik.errors.emailOrPhone ? 'border-red-400' : 'border-gray-300'}
      focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent`}
              >
                <div className="flex items-center">
                  {/* Conditionally show country code dropdown */}
                  {isPhoneNumber(formik.values.emailOrPhone) && (
                    <>
                      <select
                        name="countryCode"
                        aria-label="Country Code"
                        value={formik.values.countryCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-20 truncate border-0 bg-transparent py-3 pl-2 pr-1 text-sm focus:ring-0 focus:outline-none text-gray-700 font-medium"
                      >
                        {Array.isArray(listCountyCode) &&
                          listCountyCode.map((country) => (
                            <option key={country.dialingCode} value={country.dialingCode}>
                              {country.country} {country.dialingCode}
                            </option>
                          ))}
                      </select>
                      <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    </>
                  )}

                  {/* Input for phone/email */}
                  <input
                    type="tel"
                    name="emailOrPhone"
                    placeholder="Email Id / Contact No."
                    value={formik.values.emailOrPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="flex-1 border-0 py-3 px-2 bg-transparent focus:ring-0 focus:outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Error Message */}
              {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
                <div className="px-4 pb-2">
                  <p className="text-red-500 text-xs">{formik.errors.emailOrPhone}</p>
                </div>
              )}
            </div>

            {loginMode === 'password' && (
              <div className="mb-6">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-6 py-3 rounded-full pr-12 bg-white text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-yellow-300 text-sm mt-1">{formik.errors.password}</p>
                )}
                <div className="text-right mt-2">
                  <a href="/forgot-password" className="text-yellow-400 text-sm font-semibold">
                    Forgot Password?
                  </a>
                </div>
              </div>
            )}

            {loginMode === 'OTP' && timer > 0 && (
              <div className="mb-6">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-6 py-3 rounded-full bg-white text-sm outline-none"
                />
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-yellow-300 text-sm mt-1">{formik.errors.otp}</p>
                )}
                <div className="text-right mt-2 text-white text-sm">
                  <span>Time remaining: {formatTime(timer)}</span>
                  {showResendOtp && (
                    <button
                      type="button"
                      onClick={handleGetOtp}
                      className="text-yellow-400 font-semibold ml-4"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {loginMode === 'OTP' && timer === 0 && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300"
                >
                  GET OTP
                </button>
              </div>
            )}

            {(loginMode === 'password' || (loginMode === 'OTP' && timer > 0)) && (
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300"
                >
                  Login
                </button>
              </div>
            )}

            <div className="text-center mb-6">
              <span className="text-white">Or</span>
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={toggleLoginMode}
                className="w-full border-2 border-yellow-400 text-yellow-400 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black"
              >
                {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
              </button>
            </div>

            <div className="text-center">
              <span className="text-white text-sm">
                New User? Click{' '}
                <a href="/signUp" className="text-yellow-400 font-semibold">
                  here
                </a>{' '}
                to Sign Up
              </span>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </DynamicPage>
  );
}