import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
    prescriptions,
    showCheckbox,
    selectedIndexes = [],
    onEdit,
    onSelectChange,
}) => {
    return (
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
    );
};

export default PrescriptionTable;
