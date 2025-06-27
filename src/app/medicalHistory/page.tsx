'use client'
import React, { useState } from 'react';
import MasterHome from '../components/MasterHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faShareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

const MedicalPage = () => {
    const habits = [
        "Do You Smoke?",
        "Do You Consume Alcohol?",
        "Do You Exercise regularly?",
        "Do You Consume Caffeine?"
    ];

    const initialState = habits.reduce((acc, habit) => {
        acc[habit] = "";
        return acc;
    }, {} as Record<string, string>);

    const [habitSelections, setHabitSelections] = useState(initialState);
    const [isAllergyOpen, setIsAllergyOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAllergy, setNewAllergy] = useState("");
    const [isMedicalOpen, setIsMedicalOpen] = useState(false);
    const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
    const [newDisease, setNewDisease] = useState("");
    const [medicalHistory, setMedicalHistory] = useState(["Barley", "Barley", "Barley", "Barley"]);

    const handleSelectionChange = (habit: string, value: string) => {
        setHabitSelections(prev => ({ ...prev, [habit]: value }));
    };

    const toggleAllergySection = () => {
        setIsAllergyOpen(!isAllergyOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleAddAllergy = () => {
        if (newAllergy.trim()) {
            console.log("New allergy added:", newAllergy);
            setNewAllergy("");
            toggleModal();
        }
    };

    const toggleMedicalSection = () => {
        setIsMedicalOpen(!isMedicalOpen);
    };

    const toggleDiseaseModal = () => {
        setIsDiseaseModalOpen(!isDiseaseModalOpen);
    };

    const handleAddDisease = () => {
        if (newDisease.trim()) {
            setMedicalHistory([...medicalHistory, newDisease]);
            console.log("New disease added:", newDisease);
            setNewDisease("");
            toggleDiseaseModal();
        }
    };

    return (
        <MasterHome>
            <div className="p-4 min-w-7xl mx-auto font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button className="text-black font-bold hover:text-black">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                </div>

                <div className="flex items-center justify-center bg-white">
                    <div className="text-center">
                        <p className="text-lg font-medium">
                            Your complete medical history, always at your fingertips with <span className="text-blue-600 font-semibold">HFiles</span>.
                        </p>
                        <div className="border-t border-gray-300 w-36 mx-auto mt-2"></div>
                    </div>
                </div>

                {/* Share Button */}
                <button className="border border-gray-400 text-sm px-3 py-1 rounded hover:bg-gray-300 mt-3">
                    <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                    Share
                </button>

                {/* Card */}
                <div className="bg-white shadow-lg rounded-lg flex flex-col border border-gray-300 md:flex-row gap-6 mt-3">
                    {/* Left Panel */}
                    <div className="relative flex flex-col items-center text-center w-full border border-gray-300 md:w-1/3 bg-blue-50 p-6 rounded-lg shadow-md">
                        <div className="absolute top-0 right-0 bg-white text-xs px-3 py-1 rounded-bl-lg font-semibold shadow">
                            HF010125PAL1312
                        </div>
                        <img
                            src="/96d6a80ddef94d5b7c78919843c68d25900f7981.png"
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mt-4"
                        />
                        <h2 className="text-xl font-bold mt-3 text-blue-800">
                            Palak Jain <FontAwesomeIcon icon={faChevronDown} className="text-black" />
                        </h2>
                        <div className="mt-6 text-sm text-left w-full px-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Blood Group :</span>
                                <input
                                    type="text"
                                    value="O+"
                                    className="border border-gray-300 px-3 py-1 rounded w-20 text-center bg-white"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Weight :</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="55"
                                        className="border border-gray-300 px-3 py-1 rounded w-20 text-center bg-white"
                                    />
                                    <span className="text-sm">Kg</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Height :</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="5"
                                        className="border border-gray-300 px-3 py-1 rounded w-16 text-center bg-white"
                                    />
                                    <span className="text-sm">Feet</span>
                                    <input
                                        type="text"
                                        value="3"
                                        className="border border-gray-300 px-3 py-1 rounded w-16 text-center bg-white"
                                    />
                                    <span className="text-sm">inch</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Bmi :</span>
                                <input
                                    type="text"
                                    value="27.1"
                                    readOnly
                                    className="border border-gray-300 px-3 py-1 rounded w-20 text-center bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Social History */}
                    <div className="w-full md:w-2/3 p-4">
                        <h3 className="text-lg font-semibold text-blue-800 text-center">Social History</h3>
                        <p className="text-sm mb-4 text-center">Track your social history - Every habit counts for better health.</p>
                        <div className='border border-black mb-2'></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="text-left border-b border-gray-300">
                                        <th className="py-2 px-4 text-blue-800">Lifestyle Habits Overview</th>
                                        <th className="py-2 px-4 text-center">Daily</th>
                                        <th className="py-2 px-4 text-center">Occasionally</th>
                                        <th className="py-2 px-4 text-center">Rarely</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {habits.map((habit, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 text-black font-bold">{habit}</td>
                                            {["Daily", "Occasionally", "Rarely"].map(option => (
                                                <td key={option} className="py-2 px-4 text-center">
                                                    <input
                                                        type="radio"
                                                        name={habit}
                                                        value={option}
                                                        checked={habitSelections[habit] === option}
                                                        onChange={() => handleSelectionChange(habit, option)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='mt-4 mx-3'>
                    <p className='text-blue-800 font-bold text-xl'>View Medical Prescription</p>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border px-4 py-3 mx-4 mt-4">
                    <p className="text-gray-800 text-sm sm:text-base">
                        Easily access your family's prescriptions whenever you need.
                    </p>
                    <button className="bg-yellow-300 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md shadow-sm hover:bg-yellow-400 transition">
                        Family prescription
                    </button>
                </div>

                <div className='mt-4 mx-3'>
                    <p className='text-blue-800 font-bold text-xl'>Update your Allergies</p>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border px-4 py-3 mx-4 mt-4 cursor-pointer" onClick={toggleAllergySection}>
                    <p className="text-gray-800 text-sm md:text-base">
                        Know your allergies and take control. Add them now for safer, healthier living!
                    </p>
                    <FontAwesomeIcon icon={faChevronDown} className={`text-blue-700 w-4 h-4 transition-transform ${isAllergyOpen ? 'rotate-180' : ''}`} />
                </div>
                {isAllergyOpen && (
                    <div className="bg-white rounded-lg shadow-sm border px-4 py-3 mx-4 mt-2">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-left border-b border-gray-300">
                                    <th className="py-2 px-4 ">Type</th>
                                    <th className="py-2 px-4 text-center">Yes</th>
                                    <th className="py-2 px-4 text-center">No</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {["Barley", "Barley", "Barley", "Barley"].map((allergy, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 text-black">{allergy}</td>
                                        <td className="py-2 px-4 text-center">
                                            <input type="radio" name={`allergy-${index}`} value="yes" defaultChecked />
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            <input type="radio" name={`allergy-${index}`} value="no" />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={3} className="py-2 px-4 flex justify-between items-center">
                                        <span className="text-blue-800 cursor-pointer" onClick={toggleModal}>
                                            Your Allergy isn't here? Add your own...
                                        </span>
                                        <button className="primary text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-blue-800">Add New Allergy</h2>
                                <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
                                placeholder="Enter allergy type"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddAllergy}
                                    className="primary text-white font-semibold px-4 py-2 rounded hover:bg-blue-800"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='mt-4 mx-3'>
                    <p className='text-blue-800 font-bold text-xl'>Update your Medical History</p>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border px-4 py-3 mx-4 mt-4 cursor-pointer" onClick={toggleMedicalSection}>
                    <p className="text-gray-800 text-sm md:text-base">
                        Stay ahead with your family health history. Update now for better care.
                    </p>
                    <FontAwesomeIcon icon={faChevronDown} className={`text-blue-700 w-4 h-4 transition-transform ${isMedicalOpen ? 'rotate-180' : ''}`} />
                </div>

                {isMedicalOpen && (
                    <div className="bg-white rounded-lg shadow-sm border px-4 py-3 mx-4 mt-2">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-left border-b border-gray-300">
                                    <th className="py-2 px-4">Type</th>
                                    <th className="py-2 px-4 text-center">My Self</th>
                                    <th className="py-2 px-4 text-center">Mother's Side</th>
                                    <th className="py-2 px-4 text-center">Father's Side</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {medicalHistory.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 text-black">{item}</td>
                                        <td className="py-2 px-4 text-center">
                                            <input type="radio" name={`medical-${index}-self`} value="yes" />
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            <input type="radio" name={`medical-${index}-mother`} value="yes" />
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            <input type="radio" name={`medical-${index}-father`} value="yes" />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4} className="py-2 px-4 flex justify-between items-center">
                                        <span className="text-blue-800 cursor-pointer" onClick={toggleDiseaseModal}>
                                            Your disease isn't here? Add your own...
                                        </span>
                                        <button className="primary text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {isDiseaseModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-blue-800">Add Your Disease</h2>
                                <button onClick={toggleDiseaseModal} className="text-gray-500 hover:text-gray-700">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newDisease}
                                onChange={(e) => setNewDisease(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
                                placeholder="Enter disease name"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddDisease}
                                    className="primary text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MasterHome>
    );
};

export default MedicalPage;