import { faCheck, faPlus, faShareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface Prescription {
    member: string;
    condition: string;
    medication: string;
    dosage: string;
    schedule: string;
    timing: string;
}

interface PrescriptionTableProps {
    prescriptions: Prescription[];
    showCheckbox: boolean;
    selectedIndexes?: number[];
    onEdit?: (index: number) => void;
    onSelectChange?: (index: number, checked: boolean) => void;
    userlist?:any;
    handleBack?:any;
    setShowCheckbox?:any;
    handleChange?:any;
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
    prescriptions,
    showCheckbox,
    selectedIndexes = [],
    onEdit,
    onSelectChange,
    userlist,
    handleBack,
    setShowCheckbox,
    handleChange
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mt-6 mb-6 relative mx-3">
                    {/* Left: Back */}
                    <button
                        className="text-black font-bold hover:text-black cursor-pointer"
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
                            <FontAwesomeIcon icon={faShareAlt} />
                            Share
                        </button>

                        {/* Add Button */}
                        <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                            <FontAwesomeIcon icon={faPlus} />
                            Add
                        </button>

                        {/* Access Button */}
                        <button className="flex items-center gap-2 border border-black text-sm font-medium text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
                            <FontAwesomeIcon icon={faCheck} />
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
       
        <div className="overflow-x-auto">
            <table className="w-full border-separate  text-sm text-center ">
                <thead>
                    <tr>
                        {showCheckbox && (
                            <th className="p-2 border border-black rounded-l-lg bg-sky-200 font-semibold text-black">
                                Select
                            </th>
                        )}
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Member</th>
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Condition</th>
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Medication</th>
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Dosage</th>
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Schedule</th>
                        <th className="p-2 border border-black bg-sky-200 font-semibold text-black">Timing</th>
                        <th className="p-2 border border-black rounded-r-lg bg-sky-200 font-semibold text-black">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {prescriptions.map((item, index) => {
                        const isSelected = selectedIndexes.includes(index);
                        return (
                            <tr
                                key={index}
                                className={` border border-black group ${isSelected ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                            >
                                {showCheckbox && (
                                    <td className="p-3  border border-black ">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => onSelectChange?.(index, e.target.checked)}
                                            className="w-5 h-5 accent-black p-3  border border-black  "
                                        />
                                    </td>
                                )}
                                <td className="p-3  border border-black ">{item.member}</td>
                                <td className="p-3 border border-black ">{item.condition}</td>
                                <td className="p-3 border border-black ">{item.medication}</td>
                                <td className="p-3 border border-black ">{item.dosage}</td>
                                <td className="p-3 border border-black ">{item.schedule}</td>
                                <td className="p-3 border border-black  whitespace-pre-line">{item.timing}</td>
                                <td className="p-3 border border-black whitespace-pre-line flex items-center justify-center gap-2">
                                    <button
                                        className={`px-4 py-1 rounded text-black ${isSelected ? 'bg-green-600 border border-black' : 'bg-cyan-100 border border-black'}`}
                                        onClick={() => onEdit?.(index)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-black hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                        onClick={() => alert('Delete action')}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>

                            </tr>

                        );
                    })}
                </tbody>
            </table>
        </div>
         </div>
    );
};

export default PrescriptionTable;
