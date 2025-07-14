'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MasterHome from '../components/MasterHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faShareAlt, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import SurgicalHistory from '../components/SurgicalHistory';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { AddHistory, DeleteData, HistoryEdit, HistoryList } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface FormData {
    surgeryName: string;
    hospitalName: string;
    drName: string;
    surgeryDate: string;
}

interface FormErrors {
    [key: string]: string;
}

interface SurgeryFormData {
    surgeryName: string;
    hospitalName: string;
    drName: string;
    surgeryDate: string;
}

interface HistoryItem {
    user_surgery_id: number;
    user_id: number;
    user_surgery_details: string;
    user_surgery_year: string;
    hostname: string | null;
    drname: string | null;
}

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
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    // Edit modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

    const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const AllHistory = async () => {
        setIsLoading(true);
        const currentUserId = await getUserId();
        if (!currentUserId) {
            toast.error("Please log in to view members.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await HistoryList(currentUserId);
            setHistoryList(response?.data?.data || []);
            console.log(response.data.data, "API Response Data");
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistoryList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        AllHistory();
    }, []);

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

    const [formData, setFormData] = useState<SurgeryFormData>({
        surgeryName: "",
        hospitalName: "",
        drName: "",
        surgeryDate: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const formatDateToDDMMYYYY = (dateStr: string): string => {
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async () => {
        const currentUserId = await getUserId();
        if (!currentUserId) {
            toast.error("Please log in to view members.");
            return;
        }

        const newErrors: FormErrors = {};
        if (!formData.surgeryName.trim()) newErrors.surgeryName = "Required";
        if (!formData.hospitalName.trim()) newErrors.hospitalName = "Required";
        if (!formData.drName.trim()) newErrors.drName = "Required";
        if (!formData.surgeryDate.trim()) newErrors.surgeryDate = "Required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const formattedData = {
                    ...formData,
                    surgeryDate: formatDateToDDMMYYYY(formData.surgeryDate),
                };

                const response = await AddHistory(currentUserId, formattedData);
                const savedData = response.data;

                setFormData({ surgeryName: "", hospitalName: "", drName: "", surgeryDate: "" });
                setShowForm(false);
                toast.success(`${savedData.message}`);
                await AllHistory();
            } catch (error) {
                console.error("Error saving surgical history:", error);
            }
        }
    };

    // Yup validation schema
    const validationSchema = Yup.object({
        surgeryName: Yup.string().required('Surgery details are required'),
        drName: Yup.string().required('Doctor name is required'),
        hospitalName: Yup.string().required('Hospital name is required'),
        surgeryDate: Yup.string().required('Surgery date is required'),
    });

    // Formik configuration for edit modal
    const editFormik = useFormik({
        initialValues: {
            surgeryName: "",
            drName: "",
            hospitalName: "",
            surgeryDate: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to view members.");
                return;
            }

            if (editingIndex !== null) {
                const surgeryId = historyList[editingIndex].user_surgery_id;

                const formattedPayload = {
                    ...values,
                    surgeryDate: formatDateToDDMMYYYY(values.surgeryDate),
                };

                try {
                    const response = await HistoryEdit(surgeryId, formattedPayload);
                    toast.success(`${response.data.message}`);
                    setIsEditModalOpen(false);
                    setEditingIndex(null);
                    editFormik.resetForm();
                    await AllHistory();
                } catch (error) {
                    console.error("Error updating surgery:", error);
                }
            }
        }
        ,
    });

    // Handle edit button click
    const handleEdit = (index: number) => {
        const itemToEdit = historyList[index];
        setEditingIndex(index);
        const surgeryDate = itemToEdit.user_surgery_year;
        let formattedDate = "";
        if (surgeryDate && surgeryDate.includes("-")) {
            const [day, month, year] = surgeryDate.split("-");
            formattedDate = `${year}-${month}-${day}`;
        }
        editFormik.setValues({
            surgeryName: itemToEdit.user_surgery_details || "",
            drName: itemToEdit.drname || "",
            hospitalName: itemToEdit.hostname || "",
            surgeryDate: formattedDate,
        });

        setIsEditModalOpen(true);
    };


    // Handle modal close
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingIndex(null);
        editFormik.resetForm();
    };

    const handleDeleteSurgery = async () => {
        if (editingIndex !== null) {
            const item = historyList[editingIndex];
            const surgeryId = item.user_surgery_id;
            try {
                const response = await DeleteData(surgeryId);
                toast.success(`${response.data.message}`);
                setIsEditModalOpen(false);
                setEditingIndex(null);
                editFormik.resetForm();
                await AllHistory();
            } catch (error) {
                console.error(" Error deleting surgery:", error);
            }
        }
    };

    const handleNavigation = () => {
        router.push('/familyPrescription');
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
                    <button
                        onClick={handleNavigation}
                        className="bg-yellow-300 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md shadow-sm hover:bg-yellow-400 transition cursor-pointer"
                    >
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

                <div className="mt-4 mx-3">
                    {/* Always show the heading outside the card */}
                    <div className="flex justify-start mb-2">
                        <p className="text-blue-800 text-lg font-bold">Surgical History</p>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                        {showForm ? (
                            <SurgicalHistory
                                formData={formData}
                                handleChange={handleChange}
                                errors={errors}
                                handleSubmit={handleSubmit}
                            />
                        ) : isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Loading surgical history...</p>
                            </div>
                        ) : !historyList || historyList.length === 0 ? (
                            <div className="text-center">
                                <div className="inline-block border-b-1 border-gray-400 pb-1 px-6">
                                    <p className="text-blue-800 text-lg font-bold">Surgical History</p>
                                </div>
                                <p className="text-gray-700 mt-4">
                                    If you've had a surgery, add it now to keep a complete track of your medical history.
                                </p>
                                <button
                                    className="mt-6 px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold rounded border border-black"
                                    onClick={() => setShowForm(true)}
                                >
                                    Add Your First Surgery
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* Table with border only */}
                                <div className="rounded-xl overflow-hidden border border-gray-300">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-blue-100 text-gray-800 font-semibold">
                                            <tr>
                                                <th className="p-2 border-r">Surgery Name</th>
                                                <th className="p-2 border-r">Surgery Year</th>
                                                <th className="p-2 border-r">Hospital Name</th>
                                                <th className="p-2 border-r">Doctor Name</th>
                                                <th className="p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyList.map((item: HistoryItem, index: number) => (
                                                <tr key={index} className="border-t">
                                                    <td className="p-2 border-r">{item.user_surgery_details || "—"}</td>
                                                    <td className="p-2 border-r">
                                                        {item.user_surgery_year
                                                            ? new Date(item.user_surgery_year).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                            })
                                                            : "—"}
                                                    </td>
                                                    <td className="p-2 border-r">{item.hostname || "—"}</td>
                                                    <td className="p-2 border-r">{item.drname || "—"}</td>
                                                    <td className="p-2">
                                                        <button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleEdit(index)}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* OUTSIDE of border box */}
                                <div className="flex justify-between items-center mt-4">
                                    <span
                                        className="text-blue-700 font-medium cursor-pointer"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Have another surgery to add?
                                    </span>
                                    <button
                                        className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg border border-black"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Add More
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-[90vw]">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-blue-800">Surgical History</h2>
                                <div className="border-t border-blue-800 w-70 mx-auto mt-2"></div>
                            </div>

                            <form onSubmit={editFormik.handleSubmit}>
                                {/* Surgery Details */}
                                <div className="mb-4">
                                    <div className="bg-blue-100 text-center py-2 px-4 mb-2 rounded-lg border">
                                        <span className="text-lg font-bold text-black ">Surgery Details</span>
                                    </div>
                                    <textarea
                                        name="surgeryName"
                                        value={editFormik.values.surgeryName}
                                        onChange={editFormik.handleChange}
                                        onBlur={editFormik.handleBlur}
                                        className={`w-full border ${editFormik.touched.surgeryName && editFormik.errors.surgeryName ? 'border-red-500' : 'border-black'} px-3 py-2 rounded-lg h-24 resize-none`}
                                        placeholder="Enter surgery details..."
                                    />
                                    {editFormik.touched.surgeryName && editFormik.errors.surgeryName && (
                                        <p className="text-red-500 text-sm mt-1">{editFormik.errors.surgeryName}</p>
                                    )}
                                </div>

                                {/* Doctor's Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-black mb-1">
                                        Doctor's Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="drName"
                                        value={editFormik.values.drName}
                                        onChange={editFormik.handleChange}
                                        onBlur={editFormik.handleBlur}
                                        className={`w-full border ${editFormik.touched.drName && editFormik.errors.drName ? 'border-red-500' : 'border-black'} px-3 py-2 rounded`}
                                        placeholder="Enter doctor's name"
                                    />
                                    {editFormik.touched.drName && editFormik.errors.drName && (
                                        <p className="text-red-500 text-sm mt-1">{editFormik.errors.drName}</p>
                                    )}
                                </div>


                                {/* Hospital Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-black mb-1">
                                        Hospital Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={editFormik.values.hospitalName}
                                        onChange={editFormik.handleChange}
                                        onBlur={editFormik.handleBlur}
                                        className={`w-full border ${editFormik.touched.hospitalName && editFormik.errors.hospitalName ? 'border-red-500' : 'border-black'} px-3 py-2 rounded`}
                                        placeholder="Enter hospital name"
                                    />
                                    {editFormik.touched.hospitalName && editFormik.errors.hospitalName && (
                                        <p className="text-red-500 text-sm mt-1">{editFormik.errors.hospitalName}</p>
                                    )}
                                </div>
                                <div className="w-[120px] border border-black mb-2 mx-auto"></div>

                                {/* Surgery Date */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-blue-800 mb-1">
                                        Surgery Date
                                    </label>
                                    <input
                                        type="date"
                                        name="surgeryDate"
                                        value={editFormik.values.surgeryDate}
                                        onChange={editFormik.handleChange}
                                        onBlur={editFormik.handleBlur}
                                        className={`w-full border ${editFormik.touched.surgeryDate && editFormik.errors.surgeryDate ? 'border-red-500' : 'border-black'} px-3 py-2 rounded`}
                                    />
                                    {editFormik.touched.surgeryDate && editFormik.errors.surgeryDate && (
                                        <p className="text-red-500 text-sm mt-1">{editFormik.errors.surgeryDate}</p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleDeleteSurgery}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseEditModal}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </MasterHome>
    );
};

export default MedicalPage;