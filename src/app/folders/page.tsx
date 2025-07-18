"use client"
import React, { useEffect, useState } from 'react';
import { FaShareAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Search from '../components/Search';
import MasterHome from '../components/MasterHome';
import { toast, ToastContainer } from 'react-toastify';
import { FolderCreate, FolderList, FolderEdit, FolderDelete, FolderAccess, MemberList } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface FolderData {
    folderId: number;
    name: string;
    createdEpoch: number;
    reportCount: number;
    reportCounts: number;
    accessToUserIds?: number[]; // Added this field
    isOwner?: boolean;
    updatedEpoch?: number;
}

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    profileURL?: string;
}

interface FloatingActionButtonProps {
    onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-[10%] md:bottom-[13%] right-[5%] bg-yellow-400 hover:bg-yellow-500 text-black rounded-full md:rounded-md px-0 md:px-6 py-0 md:py-3 w-16 h-16 md:w-auto md:h-auto flex items-center justify-center gap-2 shadow-lg z-50 transition-all"
        >
            <span className="text-4xl md:text-2xl mt-[-2px] font-bold">+</span>
            <span className="hidden md:inline text-[19px] font-semibold">Create New</span>
        </button>
    );
};

export default function Folders() {
    const [showPopup, setShowPopup] = useState(false);
    const [editingFolder, setEditingFolder] = useState<FolderData | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<FolderData | null>(null);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
    const [independent, setIndependent] = useState<Member[]>([]);
    const [selectedIndependentIds, setSelectedIndependentIds] = useState<number[]>([]);
    const storedUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '';
    const [folderDataList, setFolderDataList] = useState<FolderData[]>([]);
    const [lastReportName, setLastReportName] = useState("");

    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem("userId");
            if (!encryptedUserId) return 0;
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error("Error getting userId:", error);
            return 0;
        }
    };

    const DataListFolder = async () => {
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to view members.");
                return;
            }
            const response = await FolderList(currentUserId)
            setFolderDataList(response?.data?.data)
            if (response?.data?.data?.length > 0) {
                const lastFolder = response.data.data[response.data.data.length - 1];
                setLastReportName(lastFolder.folderName || "");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const ListMember = async () => {
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to view members.");
                return;
            }
            const response = await MemberList(currentUserId);
            setIndependent(response?.data?.data?.independentMembers)
        } catch (error) {
            console.error("Error fetching members:", error);
            toast.error("Failed to load members. Please try again.");
        }
    };

    // Helper function to get existing access user IDs
    const getExistingAccessUserIds = () => {
        const accessUserIds = new Set<number>();
        
        // Get all users who have access to any of the selected folders
        selectedFolderIds.forEach(folderId => {
            const folder = folderDataList.find(f => f.folderId === folderId);
            if (folder && folder.accessToUserIds) {
                folder.accessToUserIds.forEach(userId => {
                    accessUserIds.add(userId);
                });
            }
        });
        
        return Array.from(accessUserIds);
    };

    useEffect(() => {
        DataListFolder();
    }, [])

    const getRelativeTime = (epoch: number | null): string => {
        if (!epoch) return "Unknown time";

        const now = new Date();
        const createdDate = new Date(epoch * 1000);
        const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

        const units: [string, number][] = [
            ["year", 60 * 60 * 24 * 365],
            ["month", 60 * 60 * 24 * 30],
            ["week", 60 * 60 * 24 * 7],
            ["day", 60 * 60 * 24],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1],
        ];

        for (const [unit, secondsInUnit] of units) {
            const value = Math.floor(diffInSeconds / secondsInUnit);
            if (value > 0) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
        }

        return "Just now";
    };

    const handleCreateNew = () => {
        setEditingFolder(null);
        setShowPopup(true);
    };

    const handleEditFolder = (folder: FolderData) => {
        setEditingFolder(folder);
        setShowPopup(true);
    };

    const handleDeleteFolder = async (folder: FolderData) => {
        setFolderToDelete(folder);
        setShowDeleteConfirm(true);
    };

    const handleAccessClick = () => {
        if (!selectionMode) {
            // Enable selection mode
            setSelectionMode(true);
            setSelectedFolderIds([]);
        } else {
            // Open access modal if folders are selected
            if (selectedFolderIds.length === 0) {
                toast.error("Please select at least one folder to grant access.");
                return;
            }
            
            // Pre-populate selectedIndependentIds with users who already have access
            const existingAccessUserIds = getExistingAccessUserIds();
            setSelectedIndependentIds(existingAccessUserIds);
            
            setShowAccessModal(true);
            ListMember();
        }
    };

    const handleFolderSelect = (folderId: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedFolderIds(prev => [...prev, folderId]);
        } else {
            setSelectedFolderIds(prev => prev.filter(id => id !== folderId));
        }
    };

    const handleCheckboxChange = (memberId: number) => {
        setSelectedIndependentIds(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const confirmDelete = async () => {
        if (!folderToDelete) return;

        try {
            const response = await FolderDelete(folderToDelete.folderId);
            toast.success(response?.data?.message);
            DataListFolder();
        } catch (error: any) {
            console.log(error);
        } finally {
            setShowDeleteConfirm(false);
            setFolderToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setFolderToDelete(null);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setEditingFolder(null);
    };

    const handleFolderUpdate = () => {
        DataListFolder();
    };

    const handleAccessSave = async () => {
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to grant access.");
                return;
            }

            const payload = {
                folderIds: selectedFolderIds,
                accessToUserIds: selectedIndependentIds,
                revokeAccess: false
            };

            const response = await FolderAccess(currentUserId, payload);
            toast.success(response?.data?.message);

            // Reset states
            setShowAccessModal(false);
            setSelectionMode(false);
            setSelectedFolderIds([]);
            setSelectedIndependentIds([]);
            
            // Refresh folder data to get updated access info
            DataListFolder();
        } catch (error: any) {
            console.error("Error granting access:", error);
        }
    };

    const handleAccessCancel = () => {
        setShowAccessModal(false);
        setSelectedIndependentIds([]);
    };

    const cancelSelectionMode = () => {
        setSelectionMode(false);
        setSelectedFolderIds([]);
    };

    return (
        <MasterHome>
            <div className='Main w-[95%] mx-auto sm:w-[90%]'>
                <Search />

                <div className=''>
                    <div className='flex flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-sm\6 leading-tight'>
                        <span className='text-[#0331B5] font-bold'>{storedUserName}</span>
                        <span className='text-black font-bold'>Health Library</span>
                    </div>

                    <div className="text-sm md:text-lg text-[#353935] flex items-center space-x-2 mt-1 sm:mt-3 md:justify-end lg:mr-3 md:mt-[-16px]">
                        <span className="font-semibold">Last updated:</span>
                        <span>{lastReportName}</span>
                    </div>
                </div>
                <hr className="mt-2 h-[1px] sm:h-[2px] bg-gray-400 border-none" />

                <FloatingActionButton onClick={handleCreateNew} />

                <div className="flex justify-between items-center w-full sm:px-4 py-2">
                    <div className="flex gap-2 sm:gap-4">
                        {/* Share Button */}
                        <button className="flex items-center gap-3 border border-gray-400 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
                            <FaShareAlt className="text-xs sm:text-[16px]" />
                            <span className='sm:text-[16px]'>Share</span>
                        </button>

                        {/* Access Button */}
                        <button
                            onClick={handleAccessClick}
                            className={`flex items-center gap-3 border px-3 py-1.5 rounded-md text-sm transition-all ${selectionMode
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-400 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FaCheck className="text-xs sm:text-[16px]" />
                            <span className='sm:text-[16px]'>
                                {selectionMode ? 'Grant Access' : 'Access'}
                            </span>
                        </button>

                        {/* Cancel Selection Button */}
                        {selectionMode && (
                            <button
                                onClick={cancelSelectionMode}
                                className="flex items-center gap-3 border border-gray-400 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
                            >
                                <span className='sm:text-[16px]'>Cancel</span>
                            </button>
                        )}
                    </div>

                    {/* Selection Info */}
                    {selectionMode && (
                        <div className="text-sm text-gray-600">
                            {selectedFolderIds.length} folder(s) selected
                        </div>
                    )}

                    {/* User Dropdown */}
                    <button className="flex items-center gap-3 h-[40px] border border-gray-400 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
                        <span className='sm:text-[16px]'>Ankit</span>
                        <FaChevronDown className="text-xs sm:text-[16px]" />
                    </button>
                </div>

                <div className="flex flex-row flex-wrap justify-center sm:justify-start mt-[3rem] gap-4 md:gap-6 lg:gap-8">
                    <div className="flex gap-6 md:gap-7 flex-wrap">
                        {folderDataList?.map((folder: FolderData, index: number) => {
                            const title = folder.name || `Folder ${index + 1}`;
                            const subtitle = `${getRelativeTime(folder.createdEpoch)}  |  ${folder.reportCounts} Reports`;
                            const imageSrc = "/09ec0cd855c261e47cb0ec43164ad0fc45f948d8.png";

                            const encodedTitle = encodeURIComponent(title);
                            const encodedId = encodeURIComponent(folder.folderId);

                            return (
                                <FolderCard
                                    key={folder.folderId}
                                    folder={folder}
                                    title={title}
                                    subtitle={subtitle}
                                    imageSrc={imageSrc}
                                    link={`/folders/${encodedId}/${encodedTitle}`}
                                    onEdit={handleEditFolder}
                                    onDelete={handleDeleteFolder}
                                    selectionMode={selectionMode}
                                    isSelected={selectedFolderIds.includes(folder.folderId)}
                                    onSelect={handleFolderSelect}
                                />
                            );
                        })}
                    </div>
                </div>

                {showPopup && (
                    <UploadPopup
                        onClose={handleClosePopup}
                        editingFolder={editingFolder}
                        onUpdate={handleFolderUpdate}
                    />
                )}

                {showDeleteConfirm && (
                    <DeleteConfirmationModal
                        folderName={folderToDelete?.name || ''}
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}

                {showAccessModal && (
                    <AccessModal
                        selectedFolderIds={selectedFolderIds}
                        folderDataList={folderDataList}
                        independent={independent}
                        selectedIndependentIds={selectedIndependentIds}
                        onCheckboxChange={handleCheckboxChange}
                        onSave={handleAccessSave}
                        onCancel={handleAccessCancel}
                    />
                )}
            </div>
            <ToastContainer />
        </MasterHome>
    )
}

interface FolderCardProps {
    folder: FolderData;
    title: string;
    subtitle: string;
    imageSrc: string;
    link: string;
    onEdit: (folder: FolderData) => void;
    onDelete: (folder: FolderData) => void;
    selectionMode: boolean;
    isSelected: boolean;
    onSelect: (folderId: number, isSelected: boolean) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
    folder, title, subtitle, imageSrc, link, onEdit, onDelete,
    selectionMode, isSelected, onSelect
}) => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleEdit = () => {
        setMenuOpen(false);
        onEdit(folder);
    };

    const handleDelete = () => {
        setMenuOpen(false);
        onDelete(folder);
    };

    const handleClick = () => {
        if (selectionMode) {
            onSelect(folder.folderId, !isSelected);
        } else {
            router.push(link);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect(folder.folderId, e.target.checked);
    };

    return (
        <div className={`relative flex flex-col items-center w-[140px] md:w-[180px] gap-2 p-3 rounded-md transition-all ${selectionMode
                ? isSelected
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                : 'hover:bg-gray-200'
            }`}>
            {/* Checkbox for selection mode */}
            {selectionMode && (
                <div className="absolute top-2 left-2 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
            )}

            {/* Dots icon - only show when not in selection mode */}
            {!selectionMode && (
                <div className="absolute top-2 right-2 text-gray-500 text-xl cursor-pointer">
                    <button
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600 space-y-[3px] cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="w-[4px] h-[4px] bg-gray-400 rounded-full"></span>
                        <span className="w-[4px] h-[4px] bg-gray-400 rounded-full"></span>
                        <span className="w-[4px] h-[4px] bg-gray-400 rounded-full"></span>
                    </button>

                    {/* Dropdown menu */}
                    {menuOpen && (
                        <div className="absolute top-8 right-0 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            >
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            <img
                src={imageSrc}
                alt="Folder"
                className={`w-[70px] md:w-[110px] sm:w-[95px] lg:w-[140px] xl:w-[150px] ${selectionMode ? 'cursor-pointer' : 'cursor-pointer'
                    }`}
                onClick={handleClick}
            />
            <p
                className={`text-center font-medium text-sm md:text-base text-[#333] leading-tight ${selectionMode ? 'cursor-pointer' : 'cursor-pointer'
                    }`}
                onClick={handleClick}
            >
                {title.length > 20 ? `${title.slice(0, 20)}...` : title}
            </p>

            <p
                className={`text-center text-xs text-gray-500 ${selectionMode ? 'cursor-pointer' : 'cursor-pointer'
                    }`}
                onClick={handleClick}
            >
                {subtitle}
            </p>
        </div>
    );
};

interface AccessModalProps {
    selectedFolderIds: number[];
    folderDataList: FolderData[];
    independent: Member[];
    selectedIndependentIds: number[];
    onCheckboxChange: (memberId: number) => void;
    onSave: () => void;
    onCancel: () => void;
}

const AccessModal: React.FC<AccessModalProps> = ({
    selectedFolderIds,
    folderDataList,
    independent,
    selectedIndependentIds,
    onCheckboxChange,
    onSave,
    onCancel
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const selectedFolders = folderDataList.filter(folder =>
        selectedFolderIds.includes(folder.folderId)
    );

    // Helper function to check if a member already has access to any selected folder
    const memberHasExistingAccess = (memberId: number) => {
        return selectedFolders.some(folder => 
            folder.accessToUserIds?.includes(memberId)
        );
    };

    const handleSave = async () => {
        if (selectedIndependentIds.length === 0) {
            toast.error("Please select at least one member to grant access.");
            return;
        }

        setIsLoading(true);
        try {
            await onSave();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]"
            onClick={onCancel}
        >
            <div
                className="relative w-[95%] max-w-md md:max-w-[40rem] border border-gray-300 rounded-lg bg-white px-6 py-6 shadow-lg max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    &times;
                </button>

                <h2 className="text-center text-[#0331B5] font-semibold text-lg md:text-[20px] mb-2">
                    Grant Folder Access
                </h2>

                <hr className="w-[47%] md:w-[34%] mt-[-7px] mx-auto h-[2px] bg-[#0331b5] border-none" />

                <p className="text-center text-gray-600 text-sm md:text-[16px] mb-4 mt-3">
                    Grant access to selected folders for independent members.
                </p>

                {/* Selected Folders */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Folders ({selectedFolders.length})
                    </label>
                    <div className="space-y-1 max-h-32 overflow-y-auto border p-2 rounded bg-gray-50">
                        {selectedFolders.map((folder) => (
                            <div key={folder.folderId} className="text-sm text-gray-700 py-1">
                                • {folder.name}
                                {folder.accessToUserIds && folder.accessToUserIds.length > 0 && (
                                    <span className="text-xs text-blue-600 ml-2">
                                        ({folder.accessToUserIds.length} users have access)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Independent Members */}
                {independent?.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Independent Members
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded">
                            {independent.map((member: Member) => {
                                const hasExistingAccess = memberHasExistingAccess(member.id);
                                return (
                                    <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedIndependentIds.includes(member.id)}
                                            onChange={() => onCheckboxChange(member.id)}
                                            className="text-blue-600 focus:ring-blue-500"
                                            disabled={isLoading}
                                        />
                                        <span className={`text-sm ${hasExistingAccess ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                            {member.firstName} {member.lastName}
                                            {hasExistingAccess && (
                                                <span className="text-xs text-blue-500 ml-1">(has access)</span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {independent?.length === 0 && (
                    <div className="mb-6 text-center text-gray-500 text-sm">
                        No independent members found.
                    </div>
                )}

                <div className="flex justify-center gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-[#0331b5] hover:bg-[#ffd100] hover:text-black text-white font-semibold px-6 py-2 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            'Update Access'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface UploadPopupProps {
    onClose: () => void;
    editingFolder?: FolderData | null;
    onUpdate: () => void;
}

const UploadPopup: React.FC<UploadPopupProps> = ({ onClose, editingFolder, onUpdate }) => {
    const [folderName, setFolderName] = useState(editingFolder?.name || '');
    const [isLoading, setIsLoading] = useState(false);

    const isEditMode = !!editingFolder;

    const handleSubmit = async () => {
        if (!folderName.trim()) {
            toast.error("Folder name cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            if (isEditMode) {
                const payload = { folderName: folderName.trim() };
                const response = await FolderEdit(editingFolder.folderId, payload);
                toast.success(response?.data?.message || "Folder updated successfully");
            } else {
                const payload = { folderName: folderName.trim() };
                const response = await FolderCreate(payload);
                toast.success(response?.data?.message || "Folder created successfully");
            }

            setFolderName("");
            onUpdate();
            onClose();
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} folder`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]"
            onClick={onClose}
        >
            <div
                className="relative w-[95%] max-w-md md:max-w-[40rem] border border-gray-300 rounded-lg bg-[#EFF5FF] px-6 py-6 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-center text-[#0331B5] font-semibold text-lg md:text-[20px] mb-2">
                    {isEditMode ? 'Edit Folder' : 'Create a Folder'}
                </h2>

                <hr className="w-[47%] md:w-[34%] mt-[-7px] mx-auto h-[2px] bg-[#0331b5] border-none" />

                <p className="text-center text-gray-600 text-sm md:text-[16px] mb-4 mt-3">
                    {isEditMode
                        ? 'Update the folder name to better organize your health records.'
                        : 'Easily manage and share all records related to a specific health condition from one folder.'
                    }
                </p>

                <div>
                    <p className="text-sm md:text-[17px] text-[#000000] font-semibold mb-4">Folder Name:</p>
                    <input
                        type="text"
                        placeholder="Eg. Diabetes, Thyroid . . ."
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#0331b5]"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#0331b5] hover:bg-[#ffd100] hover:text-black text-white font-semibold px-8 py-3 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : (isEditMode ? 'Update' : 'Create')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface DeleteConfirmationModalProps {
    folderName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ folderName, onConfirm, onCancel }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]"
            onClick={onCancel}
        >
            <div
                className="relative w-[95%] max-w-md md:max-w-[35rem] border border-gray-300 rounded-lg bg-white px-6 py-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onCancel}
                    disabled={isDeleting}
                >
                    &times;
                </button>

                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-red-600" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Folder
                    </h3>

                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">"{folderName}"</span>?
                        <br />
                        This action cannot be undone and all reports in this folder will be removed.
                    </p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};