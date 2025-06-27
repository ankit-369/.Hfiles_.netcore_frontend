import React from 'react'

type CountryCode = {
    country: string;
    dialingCode: string;
};

type MemberAddedProps = {
    formik: any; // You can replace this with proper `FormikProps<YourFormType>` for better typing
    handleCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    listCountyCode: CountryCode[];
    handlePhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSubmitting: boolean;
};

const MemberAdded: React.FC<MemberAddedProps> = ({ formik, handleCountryCodeChange, listCountyCode, handlePhoneNumberChange, isSubmitting }) => {
    return (
        <div>
            <div className="max-w-4xl mx-auto">
                {/* Form Container */}
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter first name"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter last name"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Relation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Relation *
                                    </label>
                                    <select
                                        name="relation"
                                        value={formik.values.relation}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formik.touched.relation && formik.errors.relation ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select relation</option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Husband">Husband</option>
                                        <option value="Grand Mother">Grand Mother</option>
                                        <option value="Grand Father">Grand Father</option>
                                        <option value="Uncle">Uncle</option>
                                        <option value="Aunt">Aunt</option>
                                        <option value="Male Staff">Male Staff</option>
                                        <option value="Female Staff">Female Staff</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Dog">Dog</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formik.touched.relation && formik.errors.relation && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.relation}</p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formik.values.dob}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        max={new Date().toISOString().split('T')[0]}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formik.touched.dob && formik.errors.dob ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formik.touched.dob && formik.errors.dob && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter email address"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Phone Number with Country Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className={`bg-white rounded-lg border ${(formik.touched.phoneNumber && formik.errors.phoneNumber) ||
                                    (formik.touched.countryCode && formik.errors.countryCode) ? 'border-red-500' : 'border-gray-300'
                                    } overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200`}>
                                    <div className="flex items-center">
                                        {/* Country Code Dropdown */}
                                        <select
                                            name="countryCode"
                                            aria-label="Country Code"
                                            value={formik.values.countryCode}
                                            onChange={handleCountryCodeChange}
                                            onBlur={formik.handleBlur}
                                            className="border-0 bg-transparent py-3 pl-3 pr-2 text-sm focus:ring-0 focus:outline-none text-gray-700 font-medium"
                                            style={{ minWidth: '160px' }}
                                        >
                                            <option value="">Select Country</option>
                                            {Array.isArray(listCountyCode) &&
                                                listCountyCode.map((country, index) => (
                                                    <option
                                                        key={index}
                                                        value={JSON.stringify({
                                                            country: country.country,
                                                            dialingCode: country.dialingCode,
                                                        })}
                                                    >
                                                        {country.country} {country.dialingCode}
                                                    </option>
                                                ))}
                                        </select>

                                        <div className="h-6 w-px bg-gray-300 mx-1"></div>

                                        {/* Phone Number Input */}
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Enter phone number"
                                            value={formik.values.phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            onBlur={formik.handleBlur}
                                            className="flex-1 border-0 py-3 px-2 bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                {((formik.touched.countryCode && formik.errors.countryCode) ||
                                    (formik.touched.phoneNumber && formik.errors.phoneNumber)) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.countryCode || formik.errors.phoneNumber}
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => formik.resetForm()}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formik.isValid}
                                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Adding Member...
                                    </div>
                                ) : (
                                    'Add Member'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MemberAdded
