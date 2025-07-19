import React from 'react'
import CustomRadioButton from './CustomRadioButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface AllergyItem {
    allergyType?: string;
    allergyName?: string;
    isAllergic: boolean;
    medicationNames?: string[];
    staticAllergyId?: number;
}

interface AllergyPartProps {
  renderAllergyWarning: () => any;
  listAllergies: any[]; // Replace 'any' with your actual allergy type
  allergySelections: { [key: string]: boolean };
  medications: string[];
  toggleMedicationDropdown: () => void;
  isMedicationDropdownOpen: boolean;
  handleAllergyChange: (index: number, value: boolean) => void;
  toggleMedicationTextarea: () => void;
  isMedicationTextareaOpen: boolean;
  medicationTextarea: string;
  setMedicationTextarea: (value: string) => void;
  setIsMedicationTextareaOpen: (value: boolean) => void;
  handleSaveMedicationTextarea: () => void;
  toggleModal: () => void;
  handleSaveAllergies: () => void;
  isAllergySaving: boolean;
}

const AllergryPart: React.FC<AllergyPartProps> = ({renderAllergyWarning,listAllergies,allergySelections ,medications , toggleMedicationDropdown , isMedicationDropdownOpen ,
    handleAllergyChange,toggleMedicationTextarea ,isMedicationTextareaOpen ,medicationTextarea , setMedicationTextarea ,setIsMedicationTextareaOpen , handleSaveMedicationTextarea ,
    toggleModal ,handleSaveAllergies ,isAllergySaving
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border px-3 sm:px-4 py-3 mx-1 sm:mx-4 mt-2">
                        {renderAllergyWarning()}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm border-collapse min-w-[200px]">
                                <thead>
                                    <tr className="text-left border-b border-gray-300">
                                        <th className="py-1 sm:py-2 px-2 sm:px-4">Type</th>
                                        <th className="py-1 sm:py-2 px-2 sm:px-4 text-center">Yes</th>
                                        <th className="py-1 sm:py-2 px-2 sm:px-4 text-center">No</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {listAllergies?.map((allergy: AllergyItem, index: number) => {
                                        const allergyName = allergy.allergyType || allergy.allergyName || '';
                                        const isMedicationAllergy = allergyName.toLowerCase() === 'medications';
                                        const isSelected = allergySelections[`allergy-${index}`] === true;

                                        return (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td className="py-1 sm:py-2 px-2 sm:px-4 text-black">
                                                        <div className="flex items-center justify-between">
                                                            <span>{allergyName}</span>
                                                            {isMedicationAllergy && isSelected && (
                                                                <div className="flex items-center gap-2">
                                                                    {medications.length > 0 && (
                                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                            {medications.length} added
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleMedicationDropdown();
                                                                        }}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                        title="Toggle medication details"
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faChevronDown}
                                                                            className={`w-3 h-3 transition-transform ${isMedicationDropdownOpen ? 'rotate-180' : ''}`}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                                                        <CustomRadioButton
                                                            name={`allergy-${index}`}
                                                            value="yes"
                                                            checked={allergySelections[`allergy-${index}`] === true}
                                                            onChange={() => handleAllergyChange(index, true)}
                                                        />
                                                    </td>
                                                    <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                                                        <CustomRadioButton
                                                            name={`allergy-${index}`}
                                                            value="no"
                                                            checked={allergySelections[`allergy-${index}`] === false}
                                                            onChange={() => handleAllergyChange(index, false)}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Medication Textarea Section */}
                                                {isMedicationAllergy && isSelected && isMedicationDropdownOpen && (
                                                    <tr key={`medication-${index}`}>
                                                        <td colSpan={3} className="px-2 sm:px-4 py-3 bg-gray-50">
                                                            <div className="border border-gray-200 rounded-lg p-4 medication-dropdown" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleMedicationTextarea();
                                                                }}>
                                                                <div className="flex items-center gap-2 mb-3 cursor-pointer" >
                                                                    <h4 className="text-sm font-semibold text-gray-700">Medications:</h4>
                                                                </div>

                                                              

                                                                {/* Medication Content - Shows/Hides based on dropdown state */}
                                                                    <div className="space-y-3">
                                                                        <textarea
                                                                            value={medicationTextarea}
                                                                            onChange={(e) => setMedicationTextarea(e.target.value)}
                                                                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm min-h-[120px] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                            placeholder="Enter medication names (one per line)&#10;Example:&#10;Aspirin&#10;Ibuprofen&#10;Paracetamol"
                                                                            autoFocus
                                                                            style={{
                                                                                caretColor: 'auto',
                                                                                cursor: 'text'
                                                                            }}
                                                                            spellCheck={false}
                                                                        />
                                                                        <div className="text-xs text-gray-500">
                                                                            Enter each medication on a separate line
                                                                        </div>
                                                                        <div className="flex justify-end space-x-2">
                                                                            <button
                                                                                onClick={() => setIsMedicationTextareaOpen(false)}
                                                                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={handleSaveMedicationTextarea}
                                                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                                                                            >
                                                                                Save Changes
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}

                                    <tr>
                                        <td colSpan={3} className="py-2 px-2 sm:px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                            <span className="text-blue-800 cursor-pointer text-xs sm:text-sm" onClick={toggleModal}>
                                                Your Allergy isn't here? Add your own...
                                            </span>
                                            <button
                                                onClick={handleSaveAllergies}
                                                disabled={isAllergySaving}
                                                className={`primary text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 rounded-md shadow-sm w-full sm:w-auto
                                                    ${isAllergySaving ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}
                                                `}
                                            >
                                                {isAllergySaving ? 'Saving...' : 'Save'}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
  )
}

export default AllergryPart
