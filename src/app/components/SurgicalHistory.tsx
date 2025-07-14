import React from 'react'
// NEW: Define props interface
interface FormData {
  surgeryName: string;
  hospitalName: string;
  drName: string;
  surgeryDate: string;
}

interface FormErrors {
  surgeryName?: string;
  hospitalName?: string;
  drName?: string;
  surgeryDate?: string;
}

interface SurgicalHistoryProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  handleSubmit: () => void;
}

const SurgicalHistory: React.FC<SurgicalHistoryProps>  = ({formData , handleChange ,errors , handleSubmit }) => {
  return (
      <div className="mt-4 flex flex-col lg:flex-row justify-between items-start gap-6">
                                {/* Left Text */}
                                <div className="lg:w-1/2 text-left">
                                    <p className="text-black text-lg font-semibold border-b pb-1 w-fit mb-3">
                                        Add your Surgery Now
                                    </p>
                                    <p className="text-gray-700">
                                        If you've had a surgery, add it now to keep a complete track of your medical history - because every detail matters when it comes to your health.
                                    </p>
                                </div>

                                {/* Right Form */}
                                <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            name="surgeryName"
                                            value={formData.surgeryName}
                                            onChange={handleChange}
                                            placeholder="Surgery Name"
                                            className="border p-2 rounded w-full"
                                        />
                                        {errors.surgeryName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.surgeryName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="hospitalName"
                                            value={formData.hospitalName}
                                            onChange={handleChange}
                                            placeholder="Enter Hospital Name"
                                            className="border p-2 rounded w-full"
                                        />
                                        {errors.hospitalName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.hospitalName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="drName"
                                            value={formData.drName}
                                            onChange={handleChange}
                                            placeholder="Enter Dr. name"
                                            className="border p-2 rounded w-full"
                                        />
                                        {errors.drName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.drName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="date"
                                            name="surgeryDate"
                                            value={formData.surgeryDate}
                                            onChange={handleChange}
                                            placeholder="DD-MM-YY"
                                            className="border p-2 rounded w-full"
                                        />
                                        {errors.surgeryDate && (
                                            <p className="text-red-500 text-sm mt-1">{errors.surgeryDate}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="col-span-2 mt-2 px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold rounded border border-black"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
  )
}

export default SurgicalHistory
