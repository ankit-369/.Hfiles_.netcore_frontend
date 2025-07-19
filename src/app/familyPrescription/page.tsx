'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import MasterHome from '../components/MasterHome';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionCard from '../components/PrescriptionCard';
import { useRouter } from 'next/navigation';
import PrescriptionModal from '../components/PrescriptionModal';
import { GetFmailyData, LIstAllData, FamilyMemberAdded, FamilyMemberEdit } from '../services/HfilesServiceApi';
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

interface Prescription {
    id?: number; // Add id field for prescription identification
    prescriptionId?: number; // Alternative id field name
    memberId: string;
    condition: string;
    otherCondition: string;
    medicine: string;
    dosage: string;
    schedule: string;
    timings: string;
}

// API Payload interface
interface ApiPayload {
    userId: number;
    memberId: number;
    condition: string;
    otherCondition: string;
    createdEpoch: number;
    medicines: {
        medicine: string;
        dosage: string;
        schedule: string;
        timings: string;
    }[];
}

const FamilyPrescriptionPage = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [userlist, setUserlist] = useState('');
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([0, 2]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState() as any;
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        console.log('Modal state changed:', isModalOpen);
    }, [isModalOpen]);

    // Function to transform modal data to API payload
    const transformToApiPayload = async (data: PrescriptionData): Promise<ApiPayload> => {
        const currentUserId = await getUserId();
        
        // Transform medications array
        const medicines = data.medications.map(med => ({
            medicine: med.medication,
            dosage: med.dosage,
            schedule: med.schedule.join(','), // Convert array to comma-separated string
            timings: med.timings.join(',')    // Convert array to comma-separated string
        }));

        return {
            userId: currentUserId,
            memberId: parseInt(data.member) || 0, // Assuming member is stored as string ID
            condition: data.condition,
            otherCondition: data.customCondition || "",
            createdEpoch: Math.floor(Date.now() / 1000), // Current timestamp in seconds
            medicines: medicines
        };
    };

    const handleSave = async (data: PrescriptionData) => {
        try {
            console.log('Prescription Data:', data);
            console.log('Is Edit Mode:', isEditMode);

            // Log medication details
            data.medications.forEach((med, index) => {
                console.log(`Medication ${index + 1}:`, {
                    name: med.medication,
                    dosage: med.dosage,
                    schedule: med.schedule,
                    timings: med.timings
                });
            });

            if (isEditMode && editingPrescription) {
                // Handle edit mode
                console.log('Updating prescription...');
                
                // Transform data to API payload format
                const apiPayload = await transformToApiPayload(data);
                console.log('Edit API Payload:', apiPayload);

                // Get prescription ID - check for different possible field names
                const prescriptionId = editingPrescription.id || 
                                     editingPrescription.prescriptionId || 
                                     editingPrescription.memberId;

                if (!prescriptionId) {
                    toast.error("Prescription ID not found. Cannot update prescription.");
                    return;
                }

                // Make API call for edit
                const response = await FamilyMemberEdit(
                    parseInt(prescriptionId.toString()), 
                    apiPayload
                );
                toast.success(`${response.data.message}`)
            

            } else {
                // Handle add mode
                console.log('Adding new prescription...');
                
                // Transform data to API payload format
                const apiPayload = await transformToApiPayload(data);
                console.log('Add API Payload:', apiPayload);

                // Make API call for add
                const response = await FamilyMemberAdded(apiPayload);
                
                if (response.data) {
                    toast.success(response.data.message || "Prescription added successfully!");
                    
                    // Refresh the prescription list
                    await ListDataFmaily();
                } else {
                    toast.error("Failed to add prescription");
                }
            }
            
            // Close modal and reset state
            setIsModalOpen(false);
            setEditingPrescription(null);
            setIsEditMode(false);
            
        } catch (error) {
            console.error("Error saving prescription:", error);
        }
    };

    const getUserId = async (): Promise<number> => {
       try {
           const encryptedUserId = localStorage.getItem("userId");
           if (!encryptedUserId) return 0;
   
           const userIdStr = await decryptData(encryptedUserId); // decrypted string: "123"
           return parseInt(userIdStr, 10); // converts to number 123
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
            toast.error("Failed to load prescription data.");
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
        if (prescriptions && prescriptions[index]) {
            const prescriptionToEdit = prescriptions[index];
            console.log('Editing prescription:', prescriptionToEdit);
            
            setEditingPrescription(prescriptionToEdit);
            setIsEditMode(true);
            setIsModalOpen(true);
        }
    };

    const handleAdd = () => {
        setEditingPrescription(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPrescription(null);
        setIsEditMode(false);
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
                        handleChange={handleChange}
                        setShowCheckbox={setShowCheckbox}
                        handleAdd={handleAdd}
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
                                    onClick={handleAdd}
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

                {/* Prescription Modal */}
                <PrescriptionModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingPrescription={editingPrescription}
                    isEditMode={isEditMode}
                />
            </div>
            <ToastContainer />
        </MasterHome>
    );
};

export default FamilyPrescriptionPage;