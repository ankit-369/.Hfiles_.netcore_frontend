import React from 'react';
import MasterHome from '../components/MasterHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
    return (
        <MasterHome>
            <div className="p-4 min-w-7xl mx-auto font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button className="text-black font-bold hover:text-black">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>

                </div>

                {/* Card */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6 mt-3">
                    {/* Left Panel */}
                    <div className="flex flex-col items-center text-center w-full md:w-1/3">
                        <img
                            src="https://i.pinimg.com/564x/19/c0/6a/19c06a59ff71a7eb7a06fc6e62568b98.jpg"
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover"
                        />
                        <h2 className="text-lg font-semibold mt-2 text-blue-600">Palak Jain</h2>
                        <span className="text-sm text-gray-500 mt-1">HF010125PAL1312</span>

                        <div className="mt-4 text-sm text-left w-full">
                            <p><strong>Blood Group:</strong> O+</p>
                            <p><strong>Weight:</strong> 55 kg</p>
                            <p><strong>Height:</strong> 5 feet 3 inch</p>
                            <p><strong>BMI:</strong> 23.1</p>
                        </div>
                    </div>

                    {/* Right Panel - Social History */}
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-blue-600">Social History</h3>
                        <p className="text-sm text-gray-500 mb-4">Track your social history - Every habit counts for better health.</p>

                        {/* Habits Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="text-left bg-gray-100">
                                        <th className="py-2 px-4">Lifestyle Habits Overview</th>
                                        <th className="py-2 px-4 text-center">Daily</th>
                                        <th className="py-2 px-4 text-center">Occasionally</th>
                                        <th className="py-2 px-4 text-center">Rarely</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {[
                                        "Do You Smoke?",
                                        "Do You Consume Alcohol?",
                                        "Do You Exercise regularly?",
                                        "Do You Consume Caffeine?"
                                    ].map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4">{item}</td>
                                            {[...Array(3)].map((_, i) => (
                                                <td key={i} className="py-2 px-4 text-center">
                                                    {(item === "Do You Consume Alcohol?" && i === 1) ||
                                                        (item === "Do You Consume Caffeine?" && i === 1) ? "😄" : "○"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <button className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300 mt-3">
                    <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                    Share
                </button>
            </div>
        </MasterHome>
    );
};

export default ProfilePage;
