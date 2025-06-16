'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './addbasicdetails.css';

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

const AddBasicDetails: React.FC = () => {
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

  const formatDateForDisplay = (date: string) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
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

  return (
    <div className="user-info-main">
      <div className="col-md-4 d-flex justify-content-md-start justify-content-start py-1">
        <button 
          className="back-arrow-btn-2" 
          onClick={() => router.push('/Dashboard')}
        >
          Back to Home
        </button>
      </div>

      <div className="container">
        <Image 
          className="plus-top-left" 
          src="/assets/plus-1.png" 
          alt="Plus decoration"
          width={50}
          height={50}
        />

        <div className="profile-container">
          {/* Profile Image Section */}
          <div className="profile-img">
            <div className="profile-ring">
              <Image
                id="imagePreview"
                src={profileImage}
                alt="Profile"
                width={200}
                height={200}
                className="profile-image"
              />
            </div>
            
            <div className="Addbasicbtnboth">
              <button 
                className="button-change" 
                onClick={showFileUpload}
              >
                Change Profile Image
              </button>
              <input
                id="profileUpload"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="profile_subcontainer">
            <div className="profile_heading">
              <p>Ready to manage your health? Let's get you set up!</p>
              <span>Fill in your details to kickstart your health journey</span>
              <div className="profile_heading_divider"></div>
            </div>

            <form onSubmit={handleSubmit} className="signin-form form-group has-search">
              {/* Left Column - 5 Fields */}
              <div className="profile-details-1">
                {/* First Name */}
                <div className="col-12">
                  <i className="fa-solid fa-circle-user form-control-feedback"></i>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="First Name"
                    style={{ color: '#707070' }}
                    required
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>

                {/* Last Name */}
                <div className="col-12">
                  <i className="fa-solid fa-circle-user form-control-feedback"></i>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Last Name"
                    style={{ color: '#707070' }}
                    required
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>

                {/* Date of Birth */}
                <div className="col-12">
                  <i className="fa-solid fa-cake-candles form-control-feedback"></i>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ color: '#707070' }}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>

                {/* Phone */}
                <div className="col-12 input-wrapper">
                  <i className="fa-solid fa-phone-volume form-control-feedback"></i>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Contact Number"
                    style={{ color: '#707070' }}
                    required
                  />
                  <Image 
                    className="country-flag"
                    src="/assets/india-flag.png"
                    alt="India flag"
                    width={25}
                    height={18}
                  />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>

                {/* Email */}
                <div className="col-12">
                  <i className="fa-solid fa-envelope form-control-feedback"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Email ID"
                    style={{ color: '#707070' }}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              {/* Right Column - 6 Fields */}
              <div className="profile-details-2">
                {/* Gender */}
                <div className="col-12">
                  <i className="fa-solid fa-venus-mars form-control-feedback"></i>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-select form-control mySelect"
                    style={{ color: 'blue' }}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Others</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                {/* Blood Group */}
                <div className="col-12">
                  <i className="fa-sharp fa-solid fa-droplet form-control-feedback"></i>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="form-select form-control mySelect"
                  >
                    <option value="0">Blood Group</option>
                    <option value="1">A+</option>
                    <option value="2">A-</option>
                    <option value="3">B+</option>
                    <option value="4">B-</option>
                    <option value="5">AB+</option>
                    <option value="6">AB-</option>
                    <option value="7">O+</option>
                    <option value="8">O-</option>
                  </select>
                </div>

                {/* Pincode */}
                <div className="col-12">
                  <i className="fa-solid fa-map-pin form-control-feedback"></i>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="form-control pincode-input"
                    placeholder="Pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <span className="pincode-input-error">{errors.pincode}</span>}
                </div>

                {/* State */}
                <div className="col-12">
                  <i className="fa-solid fa-map-location-dot form-control-feedback"></i>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-select form-control mySelect"
                    required
                  >
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>

                {/* City */}
                <div className="col-12">
                  <i className="fa-sharp fa-solid fa-city form-control-feedback"></i>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-select form-control mySelect"
                    required
                  >
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                {/* Emergency Contact */}
                <div className="col-12">
                  <i className="fa-solid fa-phone-volume form-control-feedback"></i>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Emergency Contact Number"
                    maxLength={10}
                  />
                </div>
              </div>
            </form>

            {/* Buttons */}
            <div className="profile_buttons">
              <button
                type="submit"
                onClick={handleSubmit}
                className="update-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>

              <a href="/change-password" className="change-password-link">
                <span className="click-text">Click Here to </span>
                <span className="password-text">Change Password</span>
              </a>
            </div>

            {errors.general && (
              <div className="general-error">{errors.general}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBasicDetails;