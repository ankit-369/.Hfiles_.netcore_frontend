import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction } from 'react'

interface AddMetrixDataProps {
    medicalData: any;
    weightKg: number | string;
    setWeightKg: any;
    heightFeet: number | string;
    setHeightFeet: any;
    heightInches: number | string;
    setHeightInches: any;
    bmi: number | string;
    setIsModified: Dispatch<SetStateAction<boolean>>;
    handleSaveMetrics: () => void;
    isModified: boolean;
}

const AddMetrixData: React.FC<AddMetrixDataProps> = ({ medicalData, weightKg, setWeightKg, setIsModified, heightFeet, setHeightFeet, heightInches, setHeightInches, bmi, handleSaveMetrics, isModified }) => {
    return (
        <div className="relative flex flex-col items-center text-center w-full lg:w-1/3 xl:w-1/4 2xl:w-1/3 bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md">
            <div className="absolute top-0 right-0 bg-white text-xs px-2 sm:px-3 py-1 rounded-bl-lg font-semibold shadow">
                {medicalData?.hfId}
            </div>

            <img
                src={medicalData?.profilePhoto}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full object-cover border-4 border-white shadow-md"
            />

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mt-1 sm:mt-1 text-blue-800">
                {medicalData?.fullName} <FontAwesomeIcon icon={faChevronDown} className="text-black text-sm" />
            </h2>

            <div className="mt-2 sm:mt-2 text-xs sm:text-sm text-left w-full px-2 sm:px-4 space-y-3 sm:space-y-4">

                {/* Blood Group */}
                <div className="flex items-center justify-between">
                    <span className="font-medium">Blood Group :</span>
                    <input
                        type="text"
                        value={medicalData?.bloodGroup || ''}
                        readOnly
                        className="border border-gray-300 px-2 sm:px-3 py-1 rounded w-16 sm:w-20 text-center bg-white text-xs sm:text-sm"
                    />
                </div>

                {/* Weight */}
                <div className="flex items-center justify-between">
                    <span className="font-medium">Weight :</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <input
                            type="number"
                            value={weightKg}
                            onChange={(e) => {
                                setWeightKg(Number(e.target.value));
                                setIsModified(true);
                            }}
                            className="border border-gray-300 px-2 sm:px-3 py-1 rounded w-16 sm:w-20 text-center bg-white text-xs sm:text-sm"
                        />
                        <span className="text-xs sm:text-sm">Kg</span>
                    </div>
                </div>

                {/* Height */}
                <div className="flex items-center justify-between">
                    <span className="font-medium">Height :</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <input
                            type="number"
                            value={heightFeet}
                            onChange={(e) => {
                                setHeightFeet(Number(e.target.value));
                                setIsModified(true);
                            }}
                            className="border border-gray-300 px-2 sm:px-3 py-1 rounded w-12 sm:w-16 text-center bg-white text-xs sm:text-sm"
                        />
                        <span className="text-xs sm:text-sm">Feet</span>

                        <input
                            type="number"
                            value={heightInches}
                            onChange={(e) => {
                                setHeightInches(Number(e.target.value));
                                setIsModified(true);
                            }}
                            className="border border-gray-300 px-2 sm:px-3 py-1 rounded w-12 sm:w-16 text-center bg-white text-xs sm:text-sm"
                        />
                        <span className="text-xs sm:text-sm">inch</span>
                    </div>
                </div>

                {/* BMI */}
                <div className="flex items-center justify-between">
                    <span className="font-medium">Bmi :</span>
                    <input
                        type="text"
                        value={bmi}
                        readOnly
                        className="border border-gray-300 px-2 sm:px-3 py-1 rounded w-16 sm:w-20 text-center bg-white text-xs sm:text-sm"
                    />
                </div>

                {/* Save Button */}
                {isModified && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveMetrics}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded shadow"
                        >
                            Save Metrics
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddMetrixData
