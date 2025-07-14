import { Trash2 } from 'lucide-react';
import React from 'react';

interface PrescriptionCardProps {
    prescription: any;
    showCheckbox: boolean;
    isSelected?: boolean;
    onEdit?: () => void;
    onSelectChange?: (checked: boolean) => void;
    cardNumber: number;
}



const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
    prescription,
    showCheckbox,
    isSelected = false,
    onEdit,
    onSelectChange,
    cardNumber,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-300 mb-4 overflow-hidden">
            {/* Card Header */}
            <div className="bg-white p-3 border-b border-gray-300">
                <h3 className="text-center font-medium text-blue-600">Prescription {cardNumber}</h3>
            </div>
            
            {/* Card Content */}
            <div className="flex">
                {/* Left side - Field labels */}
                <div className="w-24 bg-sky-200">
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Fields</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Member</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Condition</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Medication</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Dosage</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Schedule</div>
                    <div className="p-3 border-b border-gray-300 text-center text-sm font-medium text-black">Timing</div>
                    <div className="p-3 text-center text-sm font-medium text-black">Action</div>
                </div>
                
                {/* Right side - Values */}
                <div className="flex-1 bg-white">
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">
                        {showCheckbox && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => onSelectChange?.(e.target.checked)}
                                className="w-4 h-4 accent-blue-600"
                            />
                        )}
                    </div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.member}</div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.condition}</div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.medication}</div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.dosage}</div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.schedule}</div>
                    <div className="p-3 border-b border-l border-gray-300 text-center text-sm">{prescription.timing}</div>
                    <div className="p-3 border-l border-gray-300 text-center">
                        <div className="flex items-center justify-center gap-3">
                            <button
                                className={`px-4 py-1 rounded text-white text-sm ${isSelected ? 'bg-green-600' : 'bg-blue-500'} hover:opacity-90 transition-opacity`}
                                onClick={onEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="text-gray-600 hover:text-red-500 transition-colors"
                                onClick={() => alert('Delete action')}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default PrescriptionCard;
