import { faCheck, faPlus, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Props {
    cardNumber: number;
    prescription: {
        member: string;
        condition: string;
        medication: string;
        dosage: string;
        schedule: string;
        timing: string;
    };
    isSelected: boolean;
    showCheckbox: boolean;
    onEdit: () => void;
    onSelectChange?: (checked: boolean) => void;
}

const PrescriptionCard: React.FC<Props> = ({
    cardNumber,
    prescription,
    isSelected,
    showCheckbox,
    onEdit,
    onSelectChange
}) => {
    const rows = [
        ['Member', prescription.member],
        ['Condition', prescription.condition],
        ['Medication', prescription.medication],
        ['Dosage', prescription.dosage],
        ['Schedule', prescription.schedule],
        ['Timing', prescription.timing],
    ];

    return (
        <div className="bg-white rounded-2xl mb-6 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex overflow-hidden mb-[2px]">
                <div className="w-24 bg-sky-200 p-3 text-sm font-semibold text-black text-center rounded-tl-2xl border border-black border-r">
                    Fields
                </div>
                <div className="flex-1 bg-white flex justify-between items-center px-4 rounded-tr-2xl border border-black border-l-0">
                    <h3 className="text-blue-600 font-semibold text-base text-center flex-1">
                        Prescription {cardNumber}
                    </h3>
                    {showCheckbox && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onSelectChange?.(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                        />
                    )}
                </div>
            </div>

            {/* Field Rows */}
            {rows.map(([label, value], idx) => (
                <div
                    key={idx}
                    className="flex mb-[2px] rounded border border-black overflow-hidden"
                >
                    <div className="w-24 bg-sky-200 p-3 text-sm font-medium text-black text-center border-r border-black">
                        {label}
                    </div>
                    <div className="flex-1 p-3 text-sm text-center">{value}</div>
                </div>
            ))}

            {/* Action Row */}
            <div className="flex rounded-lg border border-black overflow-hidden">
                <div className="w-24 bg-sky-200 p-3 text-sm font-medium text-black text-center border-r border-black rounded-bl-md">
                    Action
                </div>
                <div className="flex-1 p-3 text-center rounded-br-2xl">
                    <div className="flex justify-center items-center gap-3">
                        <button
                            onClick={onEdit}
                            className={`px-4 py-1 rounded-md text-black text-sm ${
                                isSelected 
                                    ? 'bg-green-600 border border-black' 
                                    : 'bg-blue-200 border border-black'
                            } hover:opacity-90 transition-opacity`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => alert('Delete')}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionCard;