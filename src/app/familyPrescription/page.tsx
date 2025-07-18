'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import MasterHome from '../components/MasterHome';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionCard from '../components/PrescriptionCard';
import { useRouter } from 'next/navigation';
import PrescriptionModal from '../components/PrescriptionModal';
import { GetFmailyData } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { toast, ToastContainer } from 'react-toastify';

interface PrescriptionData {
    condition: string;
    member: string;
    customCondition: string;
    medications: {
        medication: string;
        dosage: string;
        schedule: string[];
        timings: string[];
    }[];
}
const FamilyPrescriptionPage = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [userlist, setUserlist] = useState('');
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([0, 2]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState() as any;

    useEffect(() => {
        console.log('Modal state changed:', isModalOpen);
    }, [isModalOpen]);

    const handleSave = (data: PrescriptionData) => {
        console.log('Prescription Data:', data);

        data.medications.forEach((med, index) => {
            console.log(`Medication ${index + 1}:`, {
                name: med.medication,
                dosage: med.dosage,
                schedule: med.schedule,
                timings: med.timings
            });
        });

        // Your save logic here...
        setIsModalOpen(false);
    };

    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem("userId");
            if (!encryptedUserId) return 0;
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error("Error getting userId:", error);
            return 0;
        }
    };



    const ListDataFmaily = async () => {
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to view members.");
                return;
            }
            const response = await GetFmailyData(currentUserId)
            setPrescriptions(response.data.data)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        ListDataFmaily();
    }, [])


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


    return (
        <MasterHome>
            <div className="p-2">
                {/* Responsive Views */}
                {/* {For Desktop view table} */}
                <div className="hidden md:block mx-4">
                    <PrescriptionTable
                        prescriptions={prescriptions}
                        showCheckbox={showCheckbox}
                        onEdit={handleEdit}
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
                            {/* {this is for mobile} */}
                            {/* Button Row */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCheckbox(!showCheckbox)}
                                    className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    <FontAwesomeIcon icon={faShareAlt} />
                                    Share
                                </button>

                                <button
                                    className="flex items-center gap-2 border cursor-pointer border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add
                                </button>

                                <button className="flex items-center gap-2 border cursor-pointer border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                                    <FontAwesomeIcon icon={faCheck} />
                                    Access
                                </button>
                            </div>
                        </div>
                    </div>

                    <PrescriptionModal isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave} />

                    {/* Prescription Cards */}
                    {/* {For Mobile view card} */}
                    {Array.isArray(prescriptions) && prescriptions.map((item, index) => (
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
            <ToastContainer />
        </MasterHome>
    );
};

export default FamilyPrescriptionPage;