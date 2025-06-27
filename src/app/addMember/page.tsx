'use client'
import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import MasterHome from '../components/MasterHome'
import { listCounty, MemberAdd } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { toast, ToastContainer } from 'react-toastify';
import ExistingAddMember from '../components/AddExistingMember/ExistingAddMember';
import MemberAdded from '../components/Member/MemberAdded';

type CountryCode = {
    country: string;
    dialingCode: string;
};

// Validation Schema
const validationSchema = Yup.object({
    firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .required('First name is required'),
    lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .required('Last name is required'),
    relation: Yup.string()
        .required('Relation is required'),
    dob: Yup.date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .required('Date of birth is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    countryCode: Yup.string()
        .required('Country code is required'),
    phoneNumber: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required')
});

const Page = () => {
    const [activeTab, setActiveTab] = useState('add')
    const [listCountyCode, setListCountryCode] = useState<CountryCode[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem("userId");
            if (!encryptedUserId) {
                return 0;
            }
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error("Error getting userId:", error);
            return 0;
        }
    };

    const ListCountry = async () => {
        try {
            const response = await listCounty();
            setListCountryCode(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching country codes:", error);
        }
    };

    useEffect(() => {
        ListCountry();
    }, []);


    const formatDate = (dob: string | Date): string => {
        const dateObj = new Date(dob);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            relation: '',
            dob: '',
            email: '',
            countryCode: '',
            phoneNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
                const countryData = JSON.parse(formik.values.countryCode);
                const combinedCountryCode = `${countryData.country} ${countryData.dialingCode}`;
                const formattedDOB = formatDate(values.dob);
                const userId = await getUserId();
                const apiPayload = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    relation: values.relation,
                    dob: formattedDOB,
                    email: values.email,
                    countryCode: combinedCountryCode,
                    phoneNumber: values.phoneNumber,
                };
                const response = await MemberAdd(userId, apiPayload);
                toast.success(`${response.data.message}`)
                router.push('/dashboard');
                resetForm();
                setActiveTab('existing');
            } catch (error: any) {
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue('countryCode', e.target.value);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        formik.setFieldValue('phoneNumber', value);
    };

    return (
        <MasterHome>
            <div className="p-6">
                {/* Tab Headers */}
                <div className="flex space-x-4 border-b mb-6">
                    <button
                        className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add Member
                    </button>
                    <button
                        className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('existing')}
                    >
                        Existing Member
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'add' && (
                        <MemberAdded formik={formik} handleCountryCodeChange={handleCountryCodeChange} listCountyCode={listCountyCode} handlePhoneNumberChange={handlePhoneNumberChange}
                            isSubmitting={isSubmitting} />
                    )}

                    {activeTab === 'existing' && (
                        <ExistingAddMember />
                    )}
                </div>

                <ToastContainer />
            </div>
        </MasterHome>
    )
}

export default Page