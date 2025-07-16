"use client"
import React, { useEffect, useState } from 'react';
import { FaShareAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Search from '../components/Search';
import MasterHome from '../components/MasterHome';
import { toast, ToastContainer } from 'react-toastify';
import { FolderCreate, FolderList, FolderEdit, FolderDelete } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


interface FolderData {
    id: number;
    folderName: string;
    createdEpoch: number;
    reportCount: number;
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
    const storedUserName = localStorage.getItem('userName') || '';
    const [folderDataList, setFolderDataList] = useState<FolderData[]>([]);

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
            setFolderDataList(response.data.data)
            console.log(response.data.data, "ghiihuigasid")
        } catch (error) {
            console.log(error)
        }
    }

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

    const confirmDelete = async () => {
        if (!folderToDelete) return;

        try {
            const response = await FolderDelete(folderToDelete.id);
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
                        <span>Thyroid Report</span>
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
                        <button className="flex items-center gap-3 border border-gray-400 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
                            <FaCheck className="text-xs sm:text-[16px]" />
                            <span className='sm:text-[16px]'>Access</span>
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <button className="flex items-center gap-3 h-[40px] border border-gray-400 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
                        <span className='sm:text-[16px]'>Ankit</span>
                        <FaChevronDown className="text-xs sm:text-[16px]" />
                    </button>
                </div>

                <div className="flex flex-row flex-wrap justify-center sm:justify-start mt-[3rem] gap-4 md:gap-6 lg:gap-8">
                    <div className="flex gap-6 md:gap-7 flex-wrap">
                        {folderDataList?.map((folder: FolderData, index: number) => {
                            const title = folder.folderName || `Folder ${index + 1}`;
                            const subtitle = `${getRelativeTime(folder.createdEpoch)}  |  ${folder.reportCount} Reports`;
                            const imageSrc = "/09ec0cd855c261e47cb0ec43164ad0fc45f948d8.png";

                            return (
                                <FolderCard
                                    key={folder.id}
                                    folder={folder}
                                    title={title}
                                    subtitle={subtitle}
                                    imageSrc={imageSrc}
                                    link={`/folders/${encodeURIComponent(title)}`}
                                    onEdit={handleEditFolder}
                                    onDelete={handleDeleteFolder}
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
                        folderName={folderToDelete?.folderName || ''}
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
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
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, title, subtitle, imageSrc, link, onEdit, onDelete }) => {
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
        router.push(link);
    };

    return (
        <div className="relative flex flex-col items-center w-[140px] md:w-[180px] gap-2 p-3 rounded-md hover:bg-gray-200">
            {/* Dots icon */}
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

            <img
                src={imageSrc}
                alt="Folder"
                className="w-[70px] md:w-[110px] sm:w-[95px] lg:w-[140px] xl:w-[150px] cursor-pointer"
                onClick={handleClick}
            />

            <p
                className="text-center font-medium text-sm md:text-base text-[#333] leading-tight cursor-pointer"
                onClick={handleClick}
            >
                {title.length > 20 ? `${title.slice(0, 20)}...` : title}
            </p>

            <p className="text-center text-xs text-gray-500 cursor-pointer" onClick={handleClick}>
                {subtitle}
            </p>
        </div>
    );
};

interface UploadPopupProps {
    onClose: () => void;
    editingFolder?: FolderData | null;
    onUpdate: () => void;
}

const UploadPopup: React.FC<UploadPopupProps> = ({ onClose, editingFolder, onUpdate }) => {
    const [folderName, setFolderName] = useState(editingFolder?.folderName || '');
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
                // Edit existing folder
                const payload = { folderName: folderName.trim() };
                const response = await FolderEdit(editingFolder.id, payload);
                toast.success(response?.data?.message || "Folder updated successfully");
            } else {
                // Create new folder
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