import React from 'react'
import CustomRadioButton from './CustomRadioButton';

type Disease = {
    id: number;
    diseaseType: string;
    myself: boolean;
    motherSide: boolean;
    fatherSide: boolean;
};

interface MedicalOpenModalProps {
  medicalHistory: any; 
  selectedDiseases: any;
  setSelectedDiseases: (value: any) => void;
  toggleDiseaseModal: () => void;
  handleSaveDiseases: () => void;
}

const MedicalOpenModal: React.FC<MedicalOpenModalProps>  = ({medicalHistory ,selectedDiseases ,setSelectedDiseases , toggleDiseaseModal , handleSaveDiseases}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border px-3 sm:px-4 py-3 mx-1 sm:mx-4 mt-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm border-collapse min-w-[250px]">
                                <thead>
                                    <tr className="text-left border-b border-gray-300">
                                        <th className="py-1 sm:py-2 px-2 sm:px-4">Type</th>
                                        <th className="py-1 sm:py-2 px-2 sm:px-4 text-start">My Self</th>
                                        <th className="py-1 sm:py-2 px-2 sm:px-4 text-start">Mother's Side</th>
                                        <th className="py-1 sm:py-2 px-2 sm:px-4 text-start">Father's Side</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {medicalHistory.map((item: Disease & { type: 'static' | 'dynamic' }, index: number) => {
                                        const key = item.type === 'static'
                                            ? `static-${index}-${item.diseaseType}`
                                            : `dynamic-${item.id}`;

                                        const label = item.diseaseType
                                            ? item.diseaseType.charAt(0).toUpperCase() + item.diseaseType.slice(1)
                                            : `Disease ${index + 1}`;

                                        const selected = selectedDiseases[key] || {
                                            myself: false,
                                            motherSide: false,
                                            fatherSide: false,
                                        };

                                        const handleChange = (field: keyof typeof selected) => {
                                            setSelectedDiseases((prev:any) => ({
                                                ...prev,
                                                [key]: {
                                                    ...prev[key],
                                                    [field]: !prev[key]?.[field],
                                                },
                                            }));
                                        };

                                        return (
                                            <tr key={key}>
                                                <td className="py-1 sm:py-2 px-2 sm:px-4 text-black">{label}</td>
                                                <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                                                    <CustomRadioButton
                                                        name={`${key}-self`}
                                                        checked={selected.myself}
                                                        onChange={() => handleChange("myself")}
                                                        value=""
                                                    />
                                                </td>
                                                <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                                                    <CustomRadioButton
                                                        name={`${key}-mother`}
                                                        checked={selected.motherSide}
                                                        onChange={() => handleChange("motherSide")}
                                                        value=""
                                                    />
                                                </td>
                                                <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                                                    <CustomRadioButton
                                                        name={`${key}-father`}
                                                        checked={selected.fatherSide}
                                                        onChange={() => handleChange("fatherSide")}
                                                        value=""
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td colSpan={4} className="py-2 px-2 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                            <span className="text-blue-800 cursor-pointer text-xs sm:text-sm" onClick={toggleDiseaseModal}>
                                                Your disease isn't here? Add your own...
                                            </span>
                                            <button
                                                onClick={handleSaveDiseases}
                                                className="primary text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow-sm hover:bg-blue-700 w-full sm:w-auto"
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
  )
}

export default MedicalOpenModal
