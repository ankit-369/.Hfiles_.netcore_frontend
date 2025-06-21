'use client';

import React, { useState, useEffect } from 'react';

const MasterHeader = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAccountSubmenuOpen, setIsAccountSubmenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Rahul',
    hfId: 'HF12345',
    profileImage: '/images/default-profile.png',
    subscriptionType: 'premium' // basic, standard, premium
  });

  const navigateTo = (path) => {
    // In a real Next.js app, you would use: router.push(path)
    // For demo purposes, we'll use window.location or you can replace with your navigation logic
    console.log(`Navigating to: ${path}`);
    // window.location.href = path; // Uncomment for actual navigation
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile') && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
        setIsAccountSubmenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // const handleLogout = () => {
  //   // Add your logout logic here
  //   console.log('Logging out...');
  //   navigateTo('/login');
  // };
   const handleLogout = () => {
    localStorage.removeItem('token'); // Or sessionStorage, or cookies
    router.push('/login');
  };

  const getSubscriptionRingClass = (type) => {
    switch (type) {
      case 'basic': return 'ring-basic';
      case 'standard': return 'ring-standard';
      case 'premium': return 'ring-premium';
      default: return 'ring-basic';
    }
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
          font-family: 'Poppins', sans-serif;
        }

        /* Header Styles */
        .top-home-icons {
          background: #0331B5;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 1000;
        }

        .common-heading img {
          width: 128px;
          height: 40px;
        }

        .common-heading {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .d-flex {
          display: flex;
        }

        .align-items-center {
          align-items: center;
        }

        /* Profile Menu Styles */
        .profile {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-align: end;
          color: white;
        }

        .profile .user {
          text-align: end;
        }

        .profile .user span {
          font-family: 'Red Hat Display', sans-serif;
          font-weight: 600;
          color: white;
        }

        .profile .img-box {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .profile .img-box img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .profile-ring {
          border-radius: 50%;
          padding: 3px;
          display: inline-block;
          transition: border 0.3s ease;
        }

        .ring-basic {
          border: 3px solid #b0dcd4;
        }

        .ring-standard {
          border: 3px solid #fff44c;
        }

        .ring-premium {
          border: 3px solid #f8ccc4;
        }

        /* Profile Menu Dropdown */
        .profile-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 250px;
          min-height: 100px;
          background: #fff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          opacity: 0;
          transform: translateY(-10px);
          visibility: hidden;
          transition: all 300ms;
          z-index: 1001;
        }

        .profile-menu.active {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }

        .profile-menu ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .profile-menu ul li {
          position: relative;
        }

        .profile-menu ul li:hover {
          background: #f5f5f5;
        }

        .profile-menu ul li a {
          text-decoration: none;
          color: #0331B5;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1em;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .profile-menu ul li a i {
          font-size: 1.2em;
          width: 20px;
        }

        .profile-hfid {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border-bottom: 2px solid #0331B5;
          background: #f8f9fa;
        }

        .profile-hfid a {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          border-bottom: none !important;
          padding: 0 !important;
        }

        /* Submenu Styles */
        .has-dropdown .dropdown {
          display: none;
          padding-left: 25px;
          background: #f8f9fa;
        }

        .has-dropdown.open .dropdown {
          display: block;
        }

        .dropdown li a {
          padding: 10px 15px;
          font-size: 0.9em;
          color: #0331B5;
        }

        .dropdown li:hover {
          background: #e9ecef;
        }

        .badge {
          background: #ffd101;
          color: #0331B5;
          padding: 2px 8px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          margin-left: 5px;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #808080;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 1em;
        }

        .logout-btn:hover {
          background: #f5f5f5;
        }

        .color-thm-blue {
          color: #0331B5 !important;
        }

        .gray-color {
          color: #808080 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-menu {
            right: 10px;
            width: 220px;
          }

          .top-home-icons {
            padding: 10px 15px;
          }
        }

        @media (max-width: 480px) {
          .profile-menu {
            width: 200px;
          }
        }
      `}</style>

      <div className="top-home-icons">
        <div className="common-heading">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/dashboard'); }}>
            <img
              src="https://hfiles.in/wp-content/uploads/2022/11/hfiles.png"
              alt="HFiles Logo"
              className="h-10 w-auto"
            />
          </a>
        </div>

        <div className="d-flex align-items-center">
          <div className="profile" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <div className="user">
              <span>{userInfo.name}</span>
            </div>
            <div className={`img-box profile-ring ${getSubscriptionRingClass(userInfo.subscriptionType)}`}>
              <img src={userInfo.profileImage} alt="User Profile" />
            </div>
          </div>

          <div className={`profile-menu ${isProfileMenuOpen ? 'active' : ''}`}>
            <ul>
              <li className="profile-hfid">
                <a>
                  <i className="fa fa-id-badge color-thm-blue"></i>
                  <span className="color-thm-blue" style={{ fontWeight: '600', fontFamily: 'Red Hat Display, sans-serif' }}>
                    {userInfo.hfId}
                  </span>
                </a>
              </li>

              <li className={`has-dropdown ${isAccountSubmenuOpen ? 'open' : ''}`}>
                <a onClick={() => setIsAccountSubmenuOpen(!isAccountSubmenuOpen)} className="color-thm-blue">
                  <i className="fa fa-user-circle"></i>
                  My Account
                </a>
                <ul className="dropdown">
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/profile'); }} className="color-thm-blue">
                      <i className="fa fa-circle-info"></i>
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/membership-card'); }} className="color-thm-blue">
                      <i className="fa fa-id-card"></i>
                      Membership Card
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/subscription-plans'); }} className="color-thm-blue">
                      <i className="fa fa-credit-card"></i>
                      Subscription Plans
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/wellness-kit'); }} className="color-thm-blue">
                      <i className="fa fa-heart-o"></i>
                      Wellness Kit
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/feedback'); }} className="color-thm-blue">
                      <i className="fa fa-comments-o"></i>
                      Feedback Form
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/manage-members'); }} className="color-thm-blue">
                  <i className="fa fa-user"></i>
                  My Members
                  <span className="badge">2</span>
                </a>
              </li>

              <li>
                <button onClick={handleLogout} className="logout-btn gray-color">
                  <i className="fa fa-right-from-bracket"></i>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterHeader;