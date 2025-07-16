'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import MasterHome from '../components/MasterHome';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionCard from '../components/PrescriptionCard';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FamilyPrescriptionPage = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [userlist, setUserlist] = useState('');
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([0, 2]);
    const router = useRouter();

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserlist(e.target.value);
    };

    const handleBack = () => {
       router.push('/medicalHistory')
    };

    const handleSelectChange = (index: number, checked: boolean) => {
        if (checked) {
            setSelectedIndexes([...selectedIndexes, index]);
        } else {
            setSelectedIndexes(selectedIndexes.filter(i => i !== index));
        }
    };

    const handleEdit = (index: number) => {
        alert(`Edit prescription at index ${index}`);
    };

    const prescriptions = [
        {
            member: "Rahul",
            condition: "Arthritis",
            medication: "Cetirizine",
            dosage: "1 tablet",
            schedule: "Twice a day",
            timing: "Morning Night"
        },
        {
            member: "Rahul",
            condition: "Arthritis",
            medication: "Cetirizine",
            dosage: "1 tablet",
            schedule: "Twice a day",
            timing: "Morning Night"
        },
        {
            member: "Rahul",
            condition: "Arthritis",
            medication: "Cetirizine",
            dosage: "1 tablet",
            schedule: "Twice a day",
            timing: "Morning Night"
        },
        {
            member: "Rahul",
            condition: "Arthritis",
            medication: "Cetirizine",
            dosage: "1 tablet",
            schedule: "Once a day",
            timing: "8 pm / after dinner"
        },
        {
            member: "Rahul",
            condition: "Arthritis",
            medication: "Cetirizine",
            dosage: "1 tablet",
            schedule: "Twice a day",
            timing: "Morning Night"
        }
    ];

    return (
        <MasterHome>
            <div className="p-2">
                {/* Responsive Views */}
                <div className="hidden md:block mx-4">
                    <PrescriptionTable
                        prescriptions={prescriptions}
                        showCheckbox={showCheckbox}
                        selectedIndexes={selectedIndexes}
                        onEdit={handleEdit}
                        onSelectChange={handleSelectChange}
                        userlist={userlist}
                        handleBack={handleBack}
                    />
                </div>
                
                {/* Mobile View */}
                <div className="block md:hidden mx-4">
                    {/* Header Section - Only shown once */}
                    <div className="mt-6 mb-6 mx-3 flex justify-center items-center">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800">
                                Family prescription
                            </h2>
                            <div className="w-32 border border-blue-300 bg-blue-300 rounded mx-auto mt-2"></div>
                        </div>
                    </div>

                    {/* Controls Section - Only shown once */}
                    <div className="mb-6 mx-auto">
                        <div className="flex flex-col items-end gap-4">
                            {/* Select Dropdown */}
                            <div className="mx-1">
                                <select
                                    name="userlist"
                                    value={userlist}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-black rounded-lg focus:outline-none bg-white"
                                    required
                                >
                                    <option value="" disabled>Select a user</option>
                                    <option value="Ankit">Ankit</option>
                                    <option value="Rahul">Rahul</option>
                                    <option value="Priya">Priya</option>
                                </select>
                            </div>

                            {/* Button Row */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCheckbox(!showCheckbox)}
                                    className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    <FontAwesomeIcon icon={faShareAlt} />
                                    Share
                                </button>

                                <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add
                                </button>

                                <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                                    <FontAwesomeIcon icon={faCheck} />
                                    Access
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Cards */}
                    {prescriptions.map((item, index) => (
                        <PrescriptionCard
                            key={index}
                            prescription={item}
                            showCheckbox={showCheckbox}
                            isSelected={selectedIndexes.includes(index)}
                            onEdit={() => handleEdit(index)}
                            onSelectChange={(checked) => handleSelectChange(index, checked)}
                            cardNumber={index + 1}
                        />
                    ))}
                </div>
            </div>
        </MasterHome>
    );
};

export default FamilyPrescriptionPage;