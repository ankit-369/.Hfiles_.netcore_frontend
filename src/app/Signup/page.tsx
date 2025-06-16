'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Calendar, Mail, Lock, Phone, ArrowLeft, Menu } from 'lucide-react';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SignUp1, UserSignUp, UserSignUpOtp, UserSignUpOtpSubmit } from '../services/HfilesServiceApi';
import Home from '../components/Home';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(0);
  const [captchaCode, setCaptchaCode] = useState('IAPST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);

  // Country codes dropdown data
  const countryCodes = [
    { code: '+91', country: 'India', display: 'IND +91' },
    { code: '+1', country: 'USA', display: 'USA +1' },
    { code: '+44', country: 'UK', display: 'UK +44' },
    { code: '+61', country: 'Australia', display: 'AUS +61' },
    { code: '+81', country: 'Japan', display: 'JPN +81' },
    { code: '+49', country: 'Germany', display: 'GER +49' },
    { code: '+33', country: 'France', display: 'FR +33' }
  ];

  // Yup validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, 'First name must be at least 3 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    dob: Yup.string()
      .matches(/^\d{2}-\d{2}-\d{4}$/, 'Please enter DOB in dd-mm-yyyy format')
      .required('Date of birth is required'),
    countryCode: Yup.string()
      .required('Country code is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ""], 'Passwords must match')
      .required('Please confirm your password'),
    captcha: Yup.string()
      .test('captcha-match', 'Invalid captcha code', function (value) {
        return value === captchaCode;
      })
      .required('Captcha is required'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'Please accept terms and conditions')
      .required('Please accept terms and conditions')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dob: '',
      countryCode: '+91',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
      termsAccepted: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Format date for API (dd-mm-yyyy to yyyy-mm-dd)
        const formatDateForApi = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };

        const payload = {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          countryCode: values.countryCode,
          dateOfBirth: formatDateForApi(values.dob),
          password: values.password,
          confirmPassword: values.confirmPassword
        };

        console.log('Signup Payload:', payload);

        const response = await UserSignUp(payload);
        console.log('API Response:', response);

        // If API call is successful, show OTP section
        setShowOtpSection(true);
        setTimer(60);

        // Show success message
        alert('Registration successful! Please check your email for OTP.');

      } catch (error) {
        console.error('Signup API failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Update validation schema when captcha changes
  useEffect(() => {
    if (formik.values.captcha && formik.values.captcha !== captchaCode) {
      formik.setFieldError('captcha', 'Invalid captcha code');
    }
  }, [captchaCode]);

  const handleOtpSubmit = async (e) => {
    debugger
    e.preventDefault();
    setOtpError('');
    setIsOtpSubmitting(true);

    if (otp.length !== 6) {
      setOtpError('Please enter valid 6-digit OTP');
      setIsOtpSubmitting(false);
      return;
    }

    try {
      // Prepare the OTP verification payload
      const otpPayload = {
        email: formik.values.email,
        otp: otp
      };

      console.log('OTP Verification Payload:', otpPayload);

      // Call the OTP verification API
      const response = await UserSignUpOtpSubmit(otpPayload);
      console.log('OTP Verification Response:', response);

      // Handle successful verification
      alert('Registration completed successfully!');

      // Redirect to login page or dashboard
      // window.location.href = '/login';
      // or use your routing method

    } catch (error) {
      console.error('OTP Verification failed:', error);
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const resendOtp = () => {
    setTimer(60);
    setOtpError('');
    setOtp('');
    console.log('Resending OTP...');
    alert('OTP resent successfully!');
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    // Clear captcha field when refreshed
    formik.setFieldValue('captcha', '');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Home>
    <div className="min-h-auto">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row ">
        {/* Left Side - Image (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 bg-white items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="relative">
              <Image
                src="/assets/signup-samanta.png"
                alt="Sign up illustration"
                width={500}
                height={600}
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div
          className="flex-1 flex items-start md:items-center justify-center p-4 md:p-8 relative"
          style={{
            backgroundColor: '#0331B5',
            backgroundImage: 'url("/Reception Page/002B.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
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
                {/* Logo */}
                <img
                  src="/Sign Up Page/Hfiles Logo.png"
                  alt="Hfiles Logo"
                  className="w-32 mx-auto mb-4"
                />
                <h1 className="text-white text-2xl md:text-3xl font-bold">Sign Up</h1>
              </div>

              {/* Form Fields - Always Visible */}
              <div className="space-y-3 md:space-y-4">
                {/* Desktop/Tablet: 2-column grid, Mobile: single column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* First Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
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
                      <p className="text-red-300 text-xs mt-1">{formik.errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
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
                      <p className="text-red-300 text-xs mt-1">{formik.errors.lastName}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
                    <input
                      type="text"
                      name="dob"
                      value={formik.values.dob}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="dd-mm-yyyy"
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <p className="text-red-300 text-xs mt-1">{formik.errors.dob}</p>
                    )}
                  </div>

                  {/* Phone Number - Merged Input */}
                  <div className="relative bg-white rounded-full border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent overflow-hidden">
                    <div className="flex items-center">
                      <select
                        name="countryCode"
                        value={formik.values.countryCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border-0 bg-transparent py-3 pl-4 pr-2 text-sm focus:ring-0 focus:outline-none text-gray-700 font-medium"
                        style={{ minWidth: '100px' }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.display}
                          </option>
                        ))}
                      </select>
                      <div className="h-6 w-px bg-gray-300 mx-1"></div>
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Phone No"
                        className="flex-1 border-0 py-3 px-2 bg-transparent focus:ring-0 focus:outline-none text-gray-700"
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-300 text-xs mt-1 ml-4">{formik.errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
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
                      <p className="text-red-300 text-xs mt-1">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
                    <input
                      type={showPassword ? "text" : "password"}
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-300 text-xs mt-1">{formik.errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password - Full width */}
                <div className="w-full flex justify-center mt-4">
                  <div className="relative w-[300px]">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
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
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-300 text-xs mt-1">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Captcha - Always Visible */}
                <div className="text-center space-y-3">
                  <div
                    className="bg-white p-4 rounded-lg inline-block border-2 border-gray-300 cursor-pointer hover:bg-gray-50 shadow-sm"
                    onClick={refreshCaptcha}
                    style={{ minWidth: '150px', height: '55px' }}
                  >
                    <span className="font-mono text-xl font-bold tracking-wider text-gray-800 select-none">{captchaCode}</span>
                  </div>
                  <br />
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
                    <p className="text-red-300 text-xs mt-1">{formik.errors.captcha}</p>
                  )}
                </div>

                {/* Terms and Conditions - Always Visible */}
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-4 h-4 text-yellow-400 bg-white border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label className="text-white text-sm text-center">
                    I accept the <a href="#" className="text-yellow-400 hover:underline">Terms & Conditions</a>
                  </label>
                </div>
                {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                  <p className="text-red-300 text-xs mt-1 text-center">{formik.errors.termsAccepted}</p>
                )}

                {/* OTP Section - Shows after successful signup */}
                {showOtpSection && (
                  <div className="space-y-4 mt-6">
                    {/* OTP Input Field */}
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

                    {/* Timer */}
                    <div className="text-right text-blue-300 text-sm font-mono pr-8">
                      {formatTime(timer)}
                    </div>

                    {/* Error Message */}
                    {otpError && <p className="text-red-300 text-sm text-center">{otpError}</p>}

                    {/* Resend OTP Button */}
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
                      className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-12 rounded-full transition-all duration-300 transform hover:scale-105 text-lg ${(isOtpSubmitting || otp.length !== 6) ? 'opacity-50' : ''
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
                    Already registered? Click <a href="/login" className="text-yellow-400 hover:underline font-bold">here</a> to Login
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Home>
  );
};

export default SignUp;