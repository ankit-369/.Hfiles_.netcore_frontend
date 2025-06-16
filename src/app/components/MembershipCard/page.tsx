'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, User, AlignCenter } from 'lucide-react';
import Header from '../components/LandingPage/Header';
import Link from 'next/link';

const MembershipCard = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errors, setErrors] = useState({});
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle window resize to manage responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data - replace with your actual data source
  const [userData, setUserData] = useState([
    {
      user_id: 1,
      user_firstname: 'dog',
      user_image: '../membershipcard/2.png',
      blood_group: '',
      emergency_contact: '',
      membership_id: 'HF010725DOG8877',
      expiry: '11/25'
    }
  ]);

  const myCard = {
    user_firstname: 'Harsh',
    membership_id: 'HF031595HAR8697',
    blood_group: 'A+',
    emergency_contact: '8007341148',
    expiry: ''
  };

  const bloodGroups = [
    { value: '0', text: 'Blood Group' },
    { value: '1', text: 'A+' },
    { value: '2', text: 'A-' },
    { value: '3', text: 'B+' },
    { value: '4', text: 'B-' },
    { value: '5', text: 'AB+' },
    { value: '6', text: 'AB-' },
    { value: '7', text: 'O+' },
    { value: '8', text: 'O-' }
  ];

  const handleCardToggle = (cardId) => {
    if (!isDesktop) {
      setExpandedCard(expandedCard === cardId ? null : cardId);
    }
  };

  const handleEdit = (userId) => {
    const user = userData.find(u => u.user_id === userId);
    setSelectedUser(user);
    setBloodGroup(user.blood_group || '0');
    setEmergencyContact(user.emergency_contact || '');
    setIsModalOpen(true);
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!validatePhoneNumber(emergencyContact)) {
      newErrors.emergencyContact = 'Please enter a valid 10-digit phone number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update user data
    setUserData(prevData => 
      prevData.map(user => 
        user.user_id === selectedUser.user_id 
          ? { 
              ...user, 
              blood_group: bloodGroups.find(bg => bg.value === bloodGroup)?.text || '',
              emergency_contact: emergencyContact 
            }
          : user
      )
    );

    setIsModalOpen(false);
    setErrors({});
    
    // Show success message (you can implement toast notification here)
    alert('Information updated successfully!');
  };

  const MembershipCardDisplay = ({ user, isMyCard = false }) => (
    <div className="membership-card-display">
      <div className="card-content">
        <div
          className="card-body-info"
          style={{
            backgroundImage: "url('../membershipcard/2.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '200px',
            padding: '40px 20px 20px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <div className="membership-id">
              <h3>{isMyCard ? myCard.membership_id : user.membership_id}</h3>
            </div>
            <div className="user-name">
              {isMyCard ? `${myCard.user_firstname} Mistry` : `${user.user_firstname} kap`}
            </div>
          </div>

          <div className="info-section">
            <div className="info-row">
              <span>Blood Group: </span>
              <span className="info-value">
                {isMyCard ? myCard.blood_group : user.blood_group || ''}
              </span>
              <span className="expiry">
                Expiry: {isMyCard ? myCard.expiry : user.expiry}
              </span>
            </div>

            <div className="info-row">
              <span>Emergency: </span>
              <span className="info-value">
                {isMyCard ? myCard.emergency_contact : user.emergency_contact}
              </span>
            </div>

            <div className="customer-service">
              Customer service: +91 9978043453
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="membership-page">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        .membership-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Poppins', sans-serif;
        }

        .back-arrow-btn-2 {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 20px;
          border-radius: 50px;
          border: 0;
          outline: 0;
          cursor: pointer;
          margin: 1rem 2rem;
          font-family: 'Red Hat Display', sans-serif;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          color: #333;
          background: transparent;
        }

        .back-arrow-btn-2:hover {
          background-color: #f0f0f0;
        }

        .card-box {
          text-align: center;
          max-width: 100%;
          margin-top: 5vh;
          padding-bottom: 10vh;
        }

        .membership-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 0 20px;
          background: linear-gradient(180deg, #FFFFFF 7%, #CAE5FF 85%);
          border-radius: 25px;
          padding: 10px;
          justify-content: center;
        }

        .membership-card h1 {
          margin: 0;
          font-weight: bold;
          color: #0331b5;
          font-family: 'Poppins', sans-serif;
        }

        .membership-card span {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
        }

        .membership-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 0 30px;
          width: 100%;
          padding-bottom: 50px;
        }

        .accordion-item {
          display: flex;
          flex-direction: column;
          outline: none;
          border: none;
          width: 100%;
          padding: 10px 0;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .card-header span {
          font-family: 'Montserrat', sans-serif;
          color: black;
          font-size: 18px;
          font-weight: 600;
        }

        .chevron-icon {
          transition: transform 0.3s ease;
        }

        .accordian-card {
          box-shadow: 0px 9px 10px 5.5px #00000014;
          padding: 10px 15px 15px 15px;
          border-radius: 30px;
          width: 93%;
        }

        .accordian-divider {
          height: 1px;
          background-color: black;
          max-width: 100%;
          margin-bottom: 11px;
          margin-top: 5px;
        }

        .membership-card-display {
          display: none;
          animation: slideFadeIn 0.5s ease-in-out forwards;
        }

        .membership-card-display.show {
          display: block;
        }

        .card-content {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          border-radius: 15px;
          padding: 10px;
          color: white;
          position: relative;
          border: 3px solid #1a43bf;
          width: 100%;
          max-width: 100%;
          margin: 10px auto;
          overflow: hidden;
        }

        .membership-card-display .card-content .card-body-info {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          font-size: 12px !important;
          width: 100%;
          min-height: 180px;
        }

        .membership-card-display .membership-id h3 {
          font-size: 18px !important;
          font-weight: bold !important;
          color: #1a43bf !important;
          text-align: center !important;
          letter-spacing: 1px !important;
          margin: 0 !important;
          margin-bottom: 8px !important;
        }

        .membership-card-display .user-name {
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
          color: #1a43bf !important;
          text-align: center !important;
        }

        .membership-card-display .info-row {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 6px !important;
          font-size: 12px !important;
          color: #1a43bf !important;
          flex-wrap: wrap !important;
          font-weight: 500 !important;
        }

        .membership-card-display .info-row span {
          font-size: 12px !important;
          font-weight: 500 !important;
          color: #1a43bf !important;
        }

        .membership-card-display .info-value {
          font-weight: 600 !important;
          font-size: 12px !important;
        }

        .membership-card-display .expiry {
          color: #1a43bf !important;
          font-weight: 500 !important;
          font-size: 12px !important;
        }

        .membership-card-display .customer-service {
          margin-top: 10px !important;
          font-size: 9px !important;
          color: #1a43bf !important;
          text-align: right !important;
          font-weight: 400 !important;
        }



        .right-align {
          display: block;
          text-align: left;
          font-weight: 500;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          text-decoration: underline;
          color: #0331B5;
          letter-spacing: 1px;
          margin-top: 5px;
          cursor: pointer;
          border: none;
          background: none;
        }

        .edit-button {
          display: none;
        }

        @keyframes slideFadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-select, .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 15px;
          font-size: 14px;
        }

        .form-select:focus, .form-input:focus {
          outline: none;
          border-color: #0331b5;
        }

        .error-message {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary {
          background-color: #0331b5;
          color: white;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        /* Mobile and Tablet Styles */
        @media (max-width: 767px) {
          .membership-card-display {
            display: none;
          }

          .membership-card-display.show {
            display: block;
          }

          .chevron-icon {
            display: block;
          }

          .card-header {
            cursor: pointer;
            padding: 20px 15px;
          }

          .edit-button {
            display: none;
          }

          .accordian-card {
            width: 95%;
            padding: 15px 20px;
            margin: 15px auto;
          }

          .card-content {
            max-width: 100%;
            margin: 15px auto;
            padding: 15px;
          }

          .membership-card-display .card-body-info {
            height: 180px !important;
            padding: 30px 15px 15px 45px !important;
          }

          .membership-card-display .membership-id h3 {
            font-size: 16px !important;
            font-weight: bold !important;
          }

          .membership-card-display .user-name {
            font-size: 14px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .info-row {
            font-size: 11px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-row span {
            font-size: 11px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-value {
            font-size: 11px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .expiry {
            font-size: 11px !important;
          }

          .membership-card-display .customer-service {
            font-size: 8px !important;
            font-weight: 400 !important;
          }

          .membership-container {
            padding: 0 20px;
            gap: 2rem;
          }
        }

        /* Tablet Styles */
        @media (min-width: 768px) and (max-width: 1023px) {
          .membership-card-display {
            display: block !important;
          }

          .edit-button {
            display: block !important;
          }

          .membership-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            padding: 0 50px;
          }

          .chevron-icon {
            display: none !important;
          }

          .card-header {
            display: block !important;
            cursor: default;
            padding: 20px 15px;
          }

          .accordian-card {
            width: 100%;
            padding: 20px 25px;
            margin: 20px auto;
          }

          .card-content {
            margin: 20px auto;
            padding: 20px;
          }

          .membership-card-display .card-body-info {
            height: 220px !important;
            padding: 40px 20px 20px 55px !important;
          }

          .membership-card-display .membership-id h3 {
            font-size: 20px !important;
            font-weight: bold !important;
          }

          .membership-card-display .user-name {
            font-size: 18px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .info-row {
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-row span {
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-value {
            font-size: 14px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .expiry {
            font-size: 14px !important;
          }

          .membership-card-display .customer-service {
            font-size: 10px !important;
            font-weight: 400 !important;
          }

          .accordian-divider {
            height: 1.5px;
            max-width: 90%;
            margin: 0 auto 20px auto;
          }

          .card-header span {
            font-size: 20px;
            font-weight: 600;
          }

          .right-align {
            padding-left: 20px;
            padding-top: 15px;
            font-size: 16px;
            font-weight: 500;
          }
        }

        /* Desktop Styles */
        @media (min-width: 1024px) {
          .membership-card-display {
            display: block !important;
          }

          .edit-button {
            display: block !important;
          }

          .membership-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            padding: 0 80px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .chevron-icon {
            display: none !important;
          }

          .card-header {
            display: block !important;
            cursor: default;
            padding: 25px 20px;
          }

          .accordian-card {
            width: 100%;
            padding: 25px 30px;
            margin: 25px auto;
          }

          .card-content {
            margin: 25px auto;
            padding: 25px;
          }

          .membership-card-display .card-body-info {
            height: 250px !important;
            padding: 50px 25px 25px 70px !important;
          }

          .membership-card-display .membership-id h3 {
            font-size: 22px !important;
            font-weight: bold !important;
            letter-spacing: 1.2px !important;
          }

          .membership-card-display .user-name {
            font-size: 18px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .info-row {
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-row span {
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .membership-card-display .info-value {
            font-size: 14px !important;
            font-weight: 600 !important;
          }

          .membership-card-display .expiry {
            font-size: 14px !important;
          }

          .membership-card-display .customer-service {
            font-size: 11px !important;
            font-weight: 400 !important;
          }

          .card-header span {
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            font-weight: 600;
          }

          .membership-card {
            padding: 30px 0;
          }

          .membership-card span {
            font-size: 21px;
          }

          .right-align {
            padding-left: 25px;
            padding-top: 20px;
            font-size: 18px;
            font-weight: 500;
          }
        }
      `}</style>

      <Header/>
      
      {/* Back Button */}
      <Link href="/" className="back-arrow-btn">
        Back
      </Link>

      {/* Main Content */}
      <div className="card-box">
        <div className="membership-card">
          <h1>Membership Card</h1>
          <span>View yours and your Family's Membership cards here</span>
        </div>

        <div className="membership-container">
          {/* My Card */}
          <div className="accordion-item">
            <div className="card-header" onClick={() => handleCardToggle('mycard')}>
              <span>My Card</span>
              <ChevronDown 
                className={`chevron-icon ${expandedCard === 'mycard' ? 'hidden' : ''}`} 
                size={20} 
              />
              <ChevronUp 
                className={`chevron-icon ${expandedCard === 'mycard' ? '' : 'hidden'}`} 
                size={20} 
              />
            </div>
            <div className="accordian-card">
              <div className="accordian-divider"></div>
              <div className={`membership-card-display ${(expandedCard === 'mycard' || isDesktop) ? 'show' : ''}`}>
                <MembershipCardDisplay user={myCard} isMyCard={true} />
              </div>
            </div>
          </div>

          {/* Dynamic User Cards */}
          {userData.map((user) => (
            <div key={user.user_id} className="accordion-item">
              <div className="card-header" onClick={() => handleCardToggle(user.user_id)}>
                <span>{user.user_firstname}'s Card</span>
                <ChevronDown 
                  className={`chevron-icon ${expandedCard === user.user_id ? 'hidden' : ''}`} 
                  size={20} 
                />
                <ChevronUp 
                  className={`chevron-icon ${expandedCard === user.user_id ? '' : 'hidden'}`} 
                  size={20} 
                />
              </div>
              <div className="accordian-card">
                <div className="accordian-divider"></div>
                <div className={`membership-card-display ${(expandedCard === user.user_id || isDesktop) ? 'show' : ''}`}>
                  <MembershipCardDisplay user={user} />
                </div>
              </div>
              <button 
                className="right-align edit-button" 
                onClick={() => handleEdit(user.user_id)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Blood Group</label>
                <select 
                  className="form-select"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg.value} value={bg.value}>
                      {bg.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Contact No."
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
                {errors.emergencyContact && (
                  <div className="error-message">{errors.emergencyContact}</div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;