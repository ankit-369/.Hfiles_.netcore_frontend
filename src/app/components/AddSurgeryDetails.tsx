import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

interface HistoryItem {
    user_surgery_id: number;
    user_id: number;
    user_surgery_details: string;
    user_surgery_year: string;
    hostname: string | null;
    drname: string | null;
}

interface AddSurgeryDetailsProps {
    historyList: HistoryItem[];
    handleEdit: (index: number) => void;
    setShowForm: (value: boolean) => void;
}

const AddSurgeryDetails: React.FC<AddSurgeryDetailsProps> = ({
    historyList, handleEdit, setShowForm }) => {
    return (
        <div>
            {/* Table with responsive design */}
            <div className="rounded-xl overflow-hidden border border-gray-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[200px]">
                        <thead className="bg-blue-100 text-gray-800 font-semibold">
                            <tr>
                                <th className="p-2 sm:p-3 border-r text-xs sm:text-sm">Surgery Name</th>
                                <th className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">Surgery Year</th>
                                <th className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">Hospital Name</th>
                                <th className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">Doctor Name</th>
                                <th className="p-2 sm:p-3 text-xs sm:text-sm">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {historyList.map((item: HistoryItem, index: number) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2 sm:p-3 border-r text-xs sm:text-sm">{item.user_surgery_details || "—"}</td>
                                    <td className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">
                                        {item.user_surgery_year
                                            ? new Date(item.user_surgery_year).toLocaleDateString("en-US", {
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                    <td className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">{item.hostname || "—"}</td>
                                    <td className="p-2 sm:p-3 border-r text-xs sm:text-sm hidden sm:table-cell">{item.drname || "—"}</td>
                                    <td className="p-2 sm:p-3">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleEdit(index)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Add More Section - Outside table */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-3 sm:gap-0">
                <span
                    className="text-blue-700 font-medium cursor-pointer text-sm sm:text-base"
                    onClick={() => setShowForm(true)}
                >
                    Have another surgery to add?
                </span>
                <button
                    className="px-4 sm:px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg border border-black text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => setShowForm(true)}
                >
                    Add More
                </button>
            </div>
        </div>
    )
}

export default AddSurgeryDetails
