'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  gender: string;
  bloodGroup: string;
  pincode: string;
  state: string;
  city: string;
  emergencyContact: string;
}

interface State {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

const addbasicdetails: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
    gender: '',
    bloodGroup: '',
    pincode: '',
    state: '',
    city: '',
    emergencyContact: ''
  });

  const [profileImage, setProfileImage] = useState<string>('/assets/default-user-profile.png');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Sample states data
  const statesData: State[] = [
    { id: '0', name: 'Select State' },
    { id: '1', name: 'Andhra Pradesh' },
    { id: '2', name: 'Arunachal Pradesh' },
    { id: '3', name: 'Assam' },
    { id: '4', name: 'Bihar' },
    { id: '5', name: 'Chhattisgarh' },
    { id: '6', name: 'Goa' },
    { id: '7', name: 'Gujarat' },
    { id: '8', name: 'Haryana' },
    { id: '9', name: 'Himachal Pradesh' },
    { id: '10', name: 'Jharkhand' },
    { id: '11', name: 'Karnataka' },
    { id: '12', name: 'Kerala' },
    { id: '13', name: 'Madhya Pradesh' },
    { id: '14', name: 'Maharashtra' },
    { id: '15', name: 'Manipur' },
    { id: '16', name: 'Meghalaya' },
    { id: '17', name: 'Mizoram' },
    { id: '18', name: 'Nagaland' },
    { id: '19', name: 'Odisha' },
    { id: '20', name: 'Punjab' },
    { id: '21', name: 'Rajasthan' },
    { id: '22', name: 'Sikkim' },
    { id: '23', name: 'Tamil Nadu' },
    { id: '24', name: 'Telangana' },
    { id: '25', name: 'Tripura' },
    { id: '26', name: 'Uttar Pradesh' },
    { id: '27', name: 'Uttarakhand' },
    { id: '28', name: 'West Bengal' },
    { id: '29', name: 'Delhi' }
  ];

  // Sample cities data
  const citiesData: Record<string, City[]> = {
    '14': [
      { id: '0', name: 'Select City' },
      { id: '1', name: 'Mumbai' },
      { id: '2', name: 'Pune' },
      { id: '3', name: 'Nagpur' },
      { id: '4', name: 'Nashik' },
      { id: '5', name: 'Aurangabad' },
      { id: '6', name: 'Solapur' },
      { id: '7', name: 'Thane' },
      { id: '8', name: 'Kalyan' }
    ],
    '11': [
      { id: '0', name: 'Select City' },
      { id: '9', name: 'Bangalore' },
      { id: '10', name: 'Mysore' },
      { id: '11', name: 'Hubli' },
      { id: '12', name: 'Mangalore' }
    ]
  };

  useEffect(() => {
    setStates(statesData);
    // Load cities for initial state
    if (formData.state && formData.state !== '0') {
      setCities(citiesData[formData.state] || []);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Input validation based on field type
    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.replace(/[^a-zA-Z ]/g, '');
    } else if (name === 'pincode') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      
      // Auto-populate state and city based on pincode
      if (processedValue.length === 6) {
        handlePincodeChange(processedValue);
      }
    } else if (name === 'emergencyContact') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Load cities when state changes
    if (name === 'state') {
      setCities(citiesData[processedValue] || []);
      setFormData(prev => ({ ...prev, city: '0' }));
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    // Sample pincode to location mapping
    const pincodeMapping: Record<string, { state: string; city: string }> = {
      '400020': { state: '14', city: '1' }, // Mumbai, Maharashtra
      '411001': { state: '14', city: '2' }, // Pune, Maharashtra
      '560001': { state: '11', city: '9' }, // Bangalore, Karnataka
    };

    const location = pincodeMapping[pincode];
    if (location) {
      setFormData(prev => ({
        ...prev,
        state: location.state,
        city: location.city
      }));
      setCities(citiesData[location.state] || []);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.state || formData.state === '0') newErrors.state = 'State is required';
    if (!formData.city || formData.city === '0') newErrors.city = 'City is required';

    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Your API call here
      console.log('Form data:', formData);
      console.log('Profile image:', profileImageFile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard or show success message
      router.push('/Dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'An error occurred while updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const showFileUpload = () => {
    const fileInput = document.getElementById('profileUpload') as HTMLInputElement;
    fileInput?.click();
  };

  // Field component for consistent styling
  const FormField: React.FC<{
    name: string;
    type?: string;
    placeholder?: string;
    icon: string;
    required?: boolean;
    maxLength?: number;
    max?: string;
    children?: React.ReactNode;
    hasFlag?: boolean;
  }> = ({ name, type = 'text', placeholder, icon, required = false, maxLength, max, children, hasFlag = false }) => (
    <div className="relative mb-4">
      <div className="relative">
        <i className={`${icon} absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 z-10 text-lg`}></i>
        {children || (
          <input
            type={type}
            name={name}
            value={formData[name as keyof FormData]}
            onChange={handleInputChange}
            className={`w-full ${hasFlag ? 'pl-12 pr-16' : 'pl-12 pr-4'} py-3 border border-gray-300 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            max={max}
          />
        )}
      </div>
      {errors[name] && (
        <span className="block text-red-500 text-xs mt-1 ml-4">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Header */}
      <div className="flex justify-between items-center p-5">
        <button 
          onClick={() => router.push('/Dashboard')}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
        >
          Back to Home
        </button>
        <div className="text-right">
          <span className="text-gray-800 font-medium">rahul</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Profile Image Section */}
          <div className="w-full lg:w-auto lg:min-w-[400px] flex flex-col items-center">
            {/* Profile Image */}
            <div className="mb-6 relative">
              <div className="w-48 h-48 rounded-full border-4 border-yellow-400 p-1 bg-white shadow-lg">
                <Image
                  id="imagePreview"
                  src={profileImage}
                  alt="Profile"
                  width={180}
                  height={180}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            
            {/* Change Image Button */}
            <button 
              onClick={showFileUpload}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Change Profile Image
            </button>
            <input
              id="profileUpload"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full max-w-5xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-3">
                Ready to manage your health? Let's get you set up!
              </h1>
              <p className="text-gray-600 text-base">
                Fill in your details to kickstart your health journey
              </p>
              <div className="w-20 h-1 bg-blue-400 mx-auto mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <FormField
                    name="firstName"
                    placeholder="rahul"
                    icon="fa-solid fa-user"
                    required
                  />

                  <FormField
                    name="lastName"
                    placeholder="sinha"
                    icon="fa-solid fa-user"
                    required
                  />

                  <FormField
                    name="dateOfBirth"
                    type="date"
                    placeholder="15-12-1997"
                    icon="fa-solid fa-calendar-days"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />

                  {/* Contact Number with Flag */}
                  <FormField
                    name="contactNumber"
                    type="tel"
                    placeholder="+91 8007341147"
                    icon="fa-solid fa-phone"
                    required
                    maxLength={10}
                    hasFlag={true}
                  >
                    <div className="relative">
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-16 py-3 border border-gray-300 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="+91 8007341147"
                        required
                        maxLength={10}
                      />
                      <Image 
                        src="/assets/india-flag.png"
                        alt="India flag"
                        width={24}
                        height={16}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      />
                    </div>
                  </FormField>

                  <FormField
                    name="email"
                    type="email"
                    placeholder="kamleshfiles2024@gmail.com"
                    icon="fa-solid fa-envelope"
                    required
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Gender */}
                  <FormField
                    name="gender"
                    icon="fa-solid fa-venus-mars"
                    required
                  >
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                        formData.gender ? 'text-gray-700' : 'text-gray-400'
                      }`}
                      required
                    >
                      <option value="" disabled>Male</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Others</option>
                    </select>
                  </FormField>

                  {/* Blood Group */}
                  <FormField
                    name="bloodGroup"
                    icon="fa-solid fa-droplet"
                  >
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                        formData.bloodGroup && formData.bloodGroup !== '0' ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      <option value="0">A+</option>
                      <option value="1">A+</option>
                      <option value="2">A-</option>
                      <option value="3">B+</option>
                      <option value="4">B-</option>
                      <option value="5">AB+</option>
                      <option value="6">AB-</option>
                      <option value="7">O+</option>
                      <option value="8">O-</option>
                    </select>
                  </FormField>

                  <FormField
                    name="pincode"
                    placeholder="400020"
                    icon="fa-solid fa-location-dot"
                    maxLength={6}
                  />

                  {/* State */}
                  <FormField
                    name="state"
                    icon="fa-solid fa-map-location-dot"
                    required
                  >
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                        formData.state && formData.state !== '0' ? 'text-gray-700' : 'text-gray-400'
                      }`}
                      required
                    >
                      <option value="14">MAHARASHTRA</option>
                      {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </select>
                  </FormField>

                  {/* City */}
                  <FormField
                    name="city"
                    icon="fa-solid fa-city"
                    required
                  >
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                        formData.city && formData.city !== '0' ? 'text-gray-700' : 'text-gray-400'
                      }`}
                      required
                    >
                      <option value="1">Mumbai</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    name="emergencyContact"
                    type="tel"
                    placeholder="Emergency Contact Number"
                    icon="fa-solid fa-phone"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col items-center space-y-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-4 px-16 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px] ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>

                <a 
                  href="/change-password" 
                  className="text-center text-sm hover:underline transition-all duration-200"
                >
                  <span className="text-gray-600">Click Here to </span>
                  <span className="text-blue-700 font-semibold underline">Change Password</span>
                </a>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                  {errors.general}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addbasicdetails;