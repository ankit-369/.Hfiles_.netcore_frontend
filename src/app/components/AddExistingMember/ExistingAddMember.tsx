'use client';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify'; // optional toast for feedback
import { decryptData } from '@/app/utils/webCrypto';
import { MemberExistingAdd } from '@/app/services/HfilesServiceApi';

const ExistingAddMember = () => {
    const [userId, setUserId] = useState<number | null>(null);

    // Function to decrypt and get userId from localStorage
    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem('userId');
            if (!encryptedUserId) return 0;
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error('Error getting userId:', error);
            return 0;
        }
    };

    // useEffect to get userId on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId();
            setUserId(id);
        };
        fetchUserId();
    }, []);

    const formik = useFormik({
        initialValues: {
            hfid: '',
        },
        validationSchema: Yup.object({
            hfid: Yup.string().required('HFID is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!userId) {
                toast.error('User ID not found');
                return;
            }
            try {
                const response = await MemberExistingAdd(userId, values);
                toast.success(`${response.data.message}`);
                resetForm();
            } catch (error) {
            }
        },
    });

    return (
        <div className="max-w-4xl mx-auto">
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="bg-white border p-6 rounded-lg shadow-sm space-y-4">
                <div>
                    <label htmlFor="hfid" className="block text-sm font-medium text-gray-700">
                        HFID
                    </label>
                    <input
                        id="hfid"
                        name="hfid"
                        type="text"
                        className={`mt-1 block w-full px-3 py-2 border ${formik.touched.hfid && formik.errors.hfid ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.hfid}
                    />
                    {formik.touched.hfid && formik.errors.hfid && (
                        <p className="text-sm text-red-600 mt-1">{formik.errors.hfid}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ExistingAddMember;
