'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPlus, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import MasterHome from '../components/MasterHome';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionCard from '../components/PrescriptionCard';
import { ArrowLeft, Check, Plus, Share2 } from 'lucide-react';

const FamilyPrescriptionPage = () => {
   const [showCheckbox, setShowCheckbox] = useState(false);
    const [userlist, setUserlist] = useState('');
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([0, 2]);

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserlist(e.target.value);
    };

    const handleBack = () => {
        alert('Navigate back to medical history');
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
                {/* Header */}
                <div className="flex justify-between items-center mt-6 mb-6 relative mx-3">
                    {/* Left: Back */}
                    <button
                        className="text-black font-bold hover:text-black"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="mr-1 inline" size={16} />
                        Back
                    </button>

                    {/* Center: Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 absolute left-1/2 transform -translate-x-1/2">
                        Family prescription
                    </h2>
                </div>

                {/* Decorative Border */}
                <div className="border-4 border-gray-200 rounded-full mt-2 mb-6 sm:mt-4 sm:mb-8"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    {/* Left: Buttons */}
                    <div className="flex flex-wrap gap-3 mx-4">
                        {/* Share Button */}
                        <button
                            onClick={() => setShowCheckbox(!showCheckbox)}
                            className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <Share2 size={16} />
                            Share
                        </button>

                        {/* Add Button */}
                        <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                            <Plus size={16} />
                            Add
                        </button>

                        {/* Access Button */}
                        <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                            <Check size={16} />
                            Access
                        </button>
                    </div>

                    {/* Right: Select Dropdown */}
                    <div className="mx-3">
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
                </div>

                {/* Responsive Views */}
                <div className="hidden md:block mx-4">
                    <PrescriptionTable
                        prescriptions={prescriptions}
                        showCheckbox={showCheckbox}
                        selectedIndexes={selectedIndexes}
                        onEdit={handleEdit}
                        onSelectChange={handleSelectChange}
                    />
                </div>
                <div className="block md:hidden mx-4">
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
