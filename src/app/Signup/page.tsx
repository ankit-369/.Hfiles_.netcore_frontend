'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Calendar, Mail, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AddSignUp, listCounty, SignUpOTPVerify } from '../services/HfilesServiceApi';
import DynamicPage from '../components/Header&Footer/DynamicPage';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { decryptData, encryptData } from '../utils/webCrypto';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(0);
  const [captchaCode, setCaptchaCode] = useState('IAPST');
  const [captchaBackground, setCaptchaBackground] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [listCountyCode, setListCountryCode] = useState<any[]>([]);





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
  // Yup validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, 'First name must be at least 3 characters')
      .required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    dob: Yup.string()
      .required('Date of birth is required')
      .matches(/^\d{2}-\d{2}-\d{4}$/, 'Please enter DOB in dd-mm-yyyy format')
      .test('age-limit', 'You must be at least 18 years old', function (value) {
        if (!value) return false;

        const [day, month, year] = value.split('-').map(Number);
        const dobDate = new Date(year, month - 1, day);

        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        const d = today.getDate() - dobDate.getDate();

        if (m < 0 || (m === 0 && d < 0)) {
          return age - 1 >= 18;
        }

        return age >= 18;
      }),
    countryCode: Yup.string().required('Country code is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .matches(/[@$!%*?&]/, 'Must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Please confirm your password'),
    captcha: Yup.string()
      .test('captcha-match', 'Invalid captcha code', function (value) {
        return value === captchaCode;
      })
      .required('Captcha is required'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'Please accept terms and conditions')
      .required('Please accept terms and conditions'),
  });

  // Generate dynamic captcha with visual effects
  const generateDynamicCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const specialChars = ['@', '#', '$', '%', '&', '*'];
    let result = '';

    // Generate 5-6 characters mix of letters, numbers, and special chars
    for (let i = 0; i < 5; i++) {
      if (i === 2 && Math.random() > 0.5) {
        // Sometimes add a special character in the middle
        result += specialChars[Math.floor(Math.random() * specialChars.length)];
      } else {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    // Generate random background pattern
    const patterns = [
      'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
      'linear-gradient(135deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)',
      'radial-gradient(circle at 20% 50%, #f5f5f5 20%, transparent 21%)',
      'linear-gradient(90deg, #f8f8f8 50%, #f0f0f0 50%)'
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const backgroundSize = Math.random() > 0.5 ? '10px 10px' : '15px 15px';

    setCaptchaCode(result);
    setCaptchaBackground(`${selectedPattern}; background-size: ${backgroundSize}`);
    return result;
  };

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
          localStorage.setItem("userId", await encryptData(data.UserId));
        } catch (error) {
          console.error("Failed to decode or decrypt token:", error);
        }
      } else {
        console.log("No authToken found in localStorage.");
      }
    };

    getDecryptedTokenData();
  }, []);

  // Format date for display (dd-mm-yyyy)
  const formatDateForDisplay = (dateStr: string | number | Date) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Convert dd-mm-yyyy to yyyy-mm-dd for date input
  const convertToDateInputFormat = (ddmmyyyy: string) => {
    if (!ddmmyyyy || !ddmmyyyy.includes('-')) return '';
    const [day, month, year] = ddmmyyyy.split('-');
    return `${year}-${month}-${day}`;
  };

  // Convert yyyy-mm-dd to dd-mm-yyyy for form
  const convertToDisplayFormat = (yyyymmdd: string) => {
    if (!yyyymmdd) return '';
    const [year, month, day] = yyyymmdd.split('-');
    return `${day}-${month}-${year}`;
  };

  // Handle date change
  const handleDateChange = (dateValue: string) => {
    const formattedDate = convertToDisplayFormat(dateValue);
    formik.setFieldValue('dob', formattedDate);
    setShowDatePicker(false);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dob: '',
      countryCode: JSON.stringify({ country: 'Ind', dialingCode: '+91' }),
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Parse the country data and combine both values
        const countryData = JSON.parse(values.countryCode);
        const combinedCountryCode = `${countryData.dialingCode}`; // e.g., "India +91"

        const otpPayload = {
          firstName: values.firstName,
          email: values.email,
          phoneNumber: values.phone,
          countryCode: combinedCountryCode, // Send both country and dialing code in one field
        };
        const response = await SignUpOTPVerify(otpPayload);
        toast.success(`${response.data.message}`);
        setShowOtpSection(true);
        setTimer(60);
      } catch (error) {
        console.error('OTP sending failed:', error);
        const err = error as any;
        toast.error(`${err.response.data.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
  });


  // Timer for OTP resend
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Initialize captcha on component mount
  useEffect(() => {
    generateDynamicCaptcha();
  }, []);

  // Update validation schema when captcha changes
  useEffect(() => {
    if (formik.values.captcha && formik.values.captcha !== captchaCode) {
      formik.setFieldError('captcha', 'Invalid captcha code');
    }
  }, [captchaCode]);

  const handleOtpSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setOtpError('');
    setIsOtpSubmitting(true);

    // Validate OTP length
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      setIsOtpSubmitting(false);
      return;
    }

    try {
      const countryData = JSON.parse(formik.values.countryCode);
      const combinedCountryCode = `${countryData.country} ${countryData.dialingCode}`;

      const formatDateForApi = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      };
      const signupPayload = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        dob: formatDateForApi(formik.values.dob),
        contact: formik.values.phone,
        email: formik.values.email,
        password: formik.values.password,
        confirmPassword: formik.values.confirmPassword,
        countryCode: combinedCountryCode,
        otp: otp,
        captcha: formik.values.captcha === captchaCode,
        termsAndConditions: formik.values.termsAccepted,
      };
      const response = await AddSignUp(signupPayload);
      localStorage.setItem("isEmailVerified", await (response.data.data.isEmailVerified));
      localStorage.setItem("isPhoneVerified", await (response.data.data.isPhoneVerified));
      localStorage.setItem("userName", await (response.data.data.username));


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
      router.push("/addbasicdetails");
    } catch (error) {
      console.error('Registration failed:', error);
      const err = error as any;
      toast.error(`${err.response.data.message}`);
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      const countryData = JSON.parse(formik.values.countryCode);
      const combinedCountryCode = `${countryData.dialingCode}`;

      setTimer(60);
      setOtpError('');
      setOtp('');
      const otpPayload = {
        firstName: formik.values.firstName,
        email: formik.values.email,
        phoneNumber: formik.values.phone,
        countryCode: combinedCountryCode,
      };
      const response = await SignUpOTPVerify(otpPayload);
      toast.success(`${response.data.message}`);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const refreshCaptcha = () => {
    generateDynamicCaptcha();
    formik.setFieldValue('captcha', '');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DynamicPage>
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-139px)] 2xl:h-[calc(100vh-140px)]">
        {/* Left Side - Image (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 bg-white items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="relative">
              <img
                src="/assets/signup-samanta.png"
                alt="Sign up illustration"
                width={1000}
                height={600}
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div
          className="flex-1 flex items-start md:items-center justify-center p-6 relative"
          style={{
            backgroundColor: '#0331B5',
            backgroundImage: 'url("/Reception Page/002B.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="w-full max-w-2xl">
            <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
              {/* Mobile Back Button */}
              <div className="md:hidden flex items-center mb-6">
                <ArrowLeft className="h-6 w-6 text-white mr-4" />
                <span className="text-white text-lg">Back</span>
              </div>

              {/* Title */}
              <div className="text-center mb-6 md:mb-8">
                <img
                  src="/Sign Up Page/Hfiles Logo.png"
                  alt="Hfiles Logo"
                  className="w-28 mx-auto mb-1"
                />
                <h1 className="text-white text-2xl md:text-3xl font-bold">Sign Up</h1>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* First Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-5 w-5 text-yellow-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-red-500 text-xs ">{formik.errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-5 w-5 text-yellow-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-red-500 text-xs ">{formik.errors.lastName}</p>
                    )}
                  </div>

                  {/* Date of Birth with Calendar */}
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-4 h-5 w-5 text-yellow-400 cursor-pointer z-10"
                      onClick={() => document.getElementById("dobPicker")?.focus()}
                    />

                    <input
                      id="dobPicker"
                      type="date"
                      name="dob"
                      value={convertToDateInputFormat(formik.values.dob)} // e.g., '1990-05-15'
                      onChange={(e) => handleDateChange(e.target.value)}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                      max={new Date().toISOString().split("T")[0]} // restrict future dates
                    />

                    {formik.touched.dob && formik.errors.dob && (
                      <p className="text-red-500 text-xs ">{formik.errors.dob}</p>
                    )}
                  </div>


                  {/* Phone Number - Merged Input */}
                  <div className="relative">
                    <div
                      className={`bg-white rounded-full border overflow-hidden 
                              ${formik.touched.phone && formik.errors.phone ? 'border-red-400' : 'border-gray-300'}
                              focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent`}
                    >
                      <div className="flex items-center">
                        {/* Country Code Dropdown */}
                        <select
                          name="countryCode"
                          aria-label="Country Code"
                          value={formik.values.countryCode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="border-0 bg-transparent py-3 pl-4 pr-2 text-sm focus:ring-0 focus:outline-none text-gray-700 font-medium"
                          style={{ minWidth: '100px' }}
                        >
                          {Array.isArray(listCountyCode) &&
                            listCountyCode.map((country, index) => (
                              <option key={index} value={JSON.stringify({ country: country.country, dialingCode: country.dialingCode })}>
                                {country.country} {country.dialingCode}
                              </option>
                            ))};



                        </select>

                        <div className="h-6 w-px bg-gray-300 mx-1"></div>

                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          name="phone"
                          aria-label="Phone Number"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Phone No"
                          className="flex-1 border-0 py-3 px-2 bg-transparent focus:ring-0 focus:outline-none text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="px-4 pb-2">
                        <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                      </div>
                    )}
                  </div>


                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-5 w-5 text-yellow-400" />
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Email ID"
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs ">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-5 w-5 text-yellow-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-xs ">{formik.errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password - Full width */}
                <div className="w-full flex justify-center mt-4">
                  <div className="relative w-[300px]">
                    <Lock className="absolute left-3 top-4 h-5 w-5 text-yellow-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Confirm Password"
                      className="w-full pl-10 pr-12 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs  ">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Dynamic Captcha */}
                <div className="text-center space-y-2">
                  <div className="relative inline-block">
                    <div
                      className="bg-white p-4 rounded-lg border-2 border-gray-300 cursor-pointer hover:bg-gray-50 shadow-sm transition-all duration-300 relative overflow-hidden"
                      onClick={refreshCaptcha}
                      style={{
                        minWidth: '180px',
                        height: '65px',
                        background: captchaBackground || 'white'
                      }}
                    >
                      <span
                        className="font-mono text-xl font-bold tracking-wider select-none relative z-10"
                        style={{
                          color: '#333',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                          transform: `rotate(${Math.random() * 6 - 3}deg)`,
                          display: 'inline-block'
                        }}
                      >
                        {captchaCode.split('').map((char, index) => (
                          <span
                            key={index}
                            style={{
                              transform: `rotate(${Math.random() * 8 - 4}deg) scale(${0.9 + Math.random() * 0.2})`,
                              display: 'inline-block',
                              margin: '0 1px',
                              color: `hsl(${Math.random() * 360}, 70%, 40%)`
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      {/* Noise lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-gray-400 opacity-30"
                            style={{
                              width: '100%',
                              height: '1px',
                              top: `${20 + i * 15}%`,
                              transform: `rotate(${Math.random() * 6 - 3}deg)`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="absolute -top-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-black p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      title="Refresh Captcha"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-white text-xs"></p>
                  <input
                    type="text"
                    name="captcha"
                    value={formik.values.captcha}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter captcha code"
                    className="w-full max-w-xs mx-auto px-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400 text-center"
                  />
                  {formik.touched.captcha && formik.errors.captcha && (
                    <p className="text-red-500 text-xs ">{formik.errors.captcha}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-4 h-4 text-yellow-400 bg-white border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label className="text-red-500 text-xs  text-center">
                    I accept the <a href="#" className="text-yellow-400 hover:underline">Terms & Conditions</a>
                  </label>
                </div>
                {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                  <p className="text-red-500 text-xs  text-center">{formik.errors.termsAccepted}</p>
                )}

                {/* OTP Section */}
                {showOtpSection && (
                  <div className="space-y-4 mt-6">
                    <div className="w-full flex justify-center">
                      <div className="relative w-[300px]">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value);
                            setOtpError('');
                          }}
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400 text-center text-lg font-mono tracking-widest"
                        />
                      </div>
                    </div>
                    <div className="text-right text-blue-300 text-sm font-mono pr-8">
                      {formatTime(timer)}
                    </div>
                    {otpError && <p className="text-red-300 text-sm text-center">{otpError}</p>}
                    {timer === 0 && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={resendOtp}
                          className="text-yellow-400 hover:text-yellow-300 underline text-sm"
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit/Register Button */}
                <div className="w-full flex justify-center mt-6">
                  {showOtpSection ? (
                    <button
                      type="button"
                      onClick={handleOtpSubmit}
                      disabled={isOtpSubmitting || otp.length !== 6}
                      className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-12 rounded-full transition-all duration-300 transform hover:scale-105 text-lg ${isOtpSubmitting || otp.length !== 6 ? 'opacity-50' : ''
                        }`}
                      style={{ minWidth: '200px' }}
                    >
                      {isOtpSubmitting ? 'Registering...' : 'Register'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 ${isSubmitting ? 'opacity-50' : ''
                        }`}
                      style={{ minWidth: '149px' }}
                    >
                      {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  )}
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <span className="text-white text-sm">
                    Already registered? Click{' '}
                    <a href="/login" className="text-yellow-400 hover:underline font-bold">
                      here
                    </a>{' '}
                    to Login
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </DynamicPage>
  );
};

export default SignUp;