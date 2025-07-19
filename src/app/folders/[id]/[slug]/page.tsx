"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from 'react';
import Search from '../../../components/Search';
import MasterHome from '@/app/components/MasterHome';
import { decryptData } from '@/app/utils/webCrypto';
import { toast, ToastContainer } from 'react-toastify';
import { ListData, UploadeBatch, ReportDelete } from '@/app/services/HfilesServiceApi'; // Added ReportDelete import
import { useRouter } from 'next/navigation';

// Report Category Enum
enum ReportCategory {
    Unknown = 0,
    LabReport = 1,
    DentalReport = 2,
    Immunization = 3,
    MedicationsPrescription = 4,
    Radiology = 5,
    Opthalmology = 6,
    SpecialReport = 7,
    InvoicesInsurance = 8
}

interface FileItem {
    id: number;
    reportName: string;
    reportCategoryName: string;
    reportUrl: string;
    fileSize: number;
    epochTime: number;
    reportCategory?: ReportCategory;
}

// Updated FileReportCard component with menu functionality
const FileReportCard: React.FC<{ file: FileItem; onDelete: (fileId: number) => void; onEdit: (file: FileItem) => void }> = ({ file, onDelete, onEdit }) => {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format epoch time to readable date
    const formatDate = (epochTime: number): string => {
        const date = new Date(epochTime * 1000);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format file size
    const formatFileSize = (sizeInKB: number): string => {
        if (sizeInKB < 1024) {
            return `${sizeInKB.toFixed(1)} KB`;
        } else {
            return `${(sizeInKB / 1024).toFixed(1)} MB`;
        }
    };

    const handleClick = () => {
        router.push(`/view-report?src=${encodeURIComponent(file.reportUrl)}&title=${encodeURIComponent(file.reportName)}&date=${file.epochTime}&category=${encodeURIComponent(file.reportCategoryName || 'No Category')}&reportId=${file.id}`);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        setShowMenu(!showMenu);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);

        router.push(`/view-report?src=${encodeURIComponent(file.reportUrl)}&title=${encodeURIComponent(file.reportName)}&date=${file.epochTime}&category=${encodeURIComponent(file.reportCategoryName || 'No Category')}&reportId=${file.id}`);
    };

     const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem("userId");
            if (!encryptedUserId) return 0;
    
            const userIdStr = await decryptData(encryptedUserId); // decrypted string: "123"
            return parseInt(userIdStr, 10); // converts to number 123
        } catch (error) {
            console.error("Error getting userId:", error);
            return 0;
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        // Show confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete "${file.reportName}"? `);
        if (!confirmDelete) {
            setShowMenu(false);
            return;
        }
        setIsDeleting(true);
        setShowMenu(false);
        try {
            // Get user ID
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error("Please log in to view members.");
                return;
            }

            // Call delete API
            const response = await ReportDelete(currentUserId, file.id);
            toast.success(`${response.data.message}`);
            onDelete(file.id);

        } catch (error: any) {
            console.error('Error deleting report:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-[#EFF5FF] rounded-xl border border-gray-200 shadow-sm min-w-[150px] sm:min-w-[200px] xl:min-w-[210px] relative">
            <div className="p-2 flex justify-between items-center w-[90%] mx-auto mt-1">
                <span className="text-sm font-semibold text-[#2C3E50] sm:text-[15px]">
                    {file.reportCategoryName || 'No Category'}
                </span>

                {/* Three-dot menu button */}
                <div className="relative" ref={menuRef}>
                    <button
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600 space-y-[3px] p-2 cursor-pointer"
                        onClick={handleMenuToggle}
                        disabled={isDeleting}
                    >
                        <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                        <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                        <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                            <div className="py-1">
                                <button
                                    onClick={handleEdit}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-2 mt-1" onClick={handleClick}>
                <img
                    src={file.reportUrl}
                    alt={file.reportName}
                    className="w-[90%] h-[120px] sm:h-[150px] xl:h-[160px] object-cover rounded-md mx-auto"
                />
            </div>

            <div className="p-2 bg-[#F9F9F9]">
                <div className='w-[90%] mx-auto'>
                    <p className="text-sm sm:text-[15px] font-medium text-gray-800 truncate" title={file.reportName}>
                        {file.reportName || 'Untitled File'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {formatDate(file.epochTime)} • {formatFileSize(file.fileSize)}
                    </p>
                </div>
            </div>

            {/* Loading overlay when deleting */}
            {isDeleting && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
            )}
        </div>
    );
};

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
            <span className="hidden md:inline text-[19px] font-semibold">Upload File</span>
        </button>
    );
};

interface FilterAndShareProps {
    onFilterChange: (categoryId: number | null) => void;
    onShareFolder: () => void;
    selectedCategoryId: number | null;
    filesCount: number;
}

const FilterAndShare: React.FC<FilterAndShareProps> = ({
    onFilterChange,
    onShareFolder,
    selectedCategoryId,
    filesCount
}) => {
    const categoryOptions = [
        { id: null, label: 'All Categories' },
        { id: ReportCategory.LabReport, label: 'Lab Report' },
        { id: ReportCategory.DentalReport, label: 'Dental Report' },
        { id: ReportCategory.Immunization, label: 'Immunization' },
        { id: ReportCategory.MedicationsPrescription, label: 'Medications/Prescription' },
        { id: ReportCategory.Radiology, label: 'Radiology' },
        { id: ReportCategory.Opthalmology, label: 'Ophthalmology' },
        { id: ReportCategory.SpecialReport, label: 'Special Report' },
        { id: ReportCategory.InvoicesInsurance, label: 'Invoices/Insurance' },
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4 mb-6">
            {/* Right-aligned button */}
            <button
                onClick={onShareFolder}
                className="border border-black text-black bg-gray-100 px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                </svg>
                Share
            </button>

            {/* Left-aligned select */}
            <div className="flex-1 sm:max-w-[250px]">
                <select
                    value={selectedCategoryId ?? ''}
                    onChange={(e) => onFilterChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    {categoryOptions.map((option) => (
                        <option key={option.id ?? 'all'} value={option.id ?? ''}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default function Folders() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [folderName, setFolderName] = useState('');
    const [folderId, setFolderId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const storedUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathSegments = window.location.pathname.split('/');
            const id = pathSegments[2];
            const name = decodeURIComponent(pathSegments[3]);

            setFolderName(name);
            setFolderId(parseInt(id, 10));
        }
    }, []);

    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem('userId');
            if (!encryptedUserId) return 0;
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error('Error getting userId:', error);
            return 0;
        }
    };

    const DocList = async (reportCategoryId: any) => {
        setIsLoading(true);
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error('Please log in to view reports.');
                return;
            }

            if (!folderId) {
                console.warn('No folder ID available yet');
                return;
            }
            // Pass reportCategoryId (the numeric ID) to the API
            const response = await ListData(currentUserId, folderId, reportCategoryId);

            if (response?.data?.data) {
                setFiles(response.data.data);
                if (response.data.data.length > 0) {
                    const mostRecentFile = response.data.data.reduce((latest: FileItem, current: FileItem) =>
                        current.epochTime > latest.epochTime ? current : latest
                    );
                    const date = new Date(mostRecentFile.epochTime * 1000);
                    setLastUpdated(date.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }));
                }
            } else {
                console.warn('No files data received from API');
                setFiles([]);
            }
        } catch (error: any) {
            console.error('Error fetching files:', error);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (folderId) {
            DocList(selectedCategoryId);
        }
    }, [folderId, selectedCategoryId]);

    const refreshFiles = () => {
        DocList(selectedCategoryId);
    };

    const handleUploadSuccess = () => {
        setShowPopup(false);
        refreshFiles();
    };

    const handleFilterChange = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
        console.log('Selected category ID:', categoryId);
    };

    const handleShareFolder = () => {
        // Generate shareable link
        const shareUrl = window.location.href;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success('Folder link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success('Folder link copied to clipboard!');
        });
    };

    // Handle file deletion
    const handleFileDelete = (fileId: number) => {
        // Remove the deleted file from the state
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    // Handle file edit
    const handleFileEdit = (file: FileItem) => {
        // Implement edit functionality here
        // For now, just show a toast - you can implement your edit logic
        toast.info(`Edit functionality for "${file.reportName}" - implement as needed`);
        console.log('Edit file:', file);
    };

    return (
        <MasterHome>
            <div className='Main w-[95%] mx-auto sm:w-[90%]'>
                <Search />

                <div className=''>
                    <div className='flex flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-sm\6 leading-tight'>
                        <span className='text-[#0331B5] font-bold'>{storedUserName}</span>
                        <span className="text-black font-bold">{folderName}</span>
                    </div>

                    <div className="text-sm md:text-lg text-[#353935] flex items-center space-x-2 mt-1 sm:mt-3 md:justify-end lg:mr-3 md:mt-[-16px]">
                        <span className="font-semibold">Last updated:</span>
                        <span>{lastUpdated || 'No updates yet'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{files.length} Reports</span>
                    </div>
                </div>
                <hr className="mt-2 h-[1px] sm:h-[2px] bg-gray-400 border-none" />

                <FilterAndShare
                    onFilterChange={handleFilterChange}
                    onShareFolder={handleShareFolder}
                    selectedCategoryId={selectedCategoryId}
                    filesCount={files.length}
                />

                <FloatingActionButton onClick={() => setShowPopup(true)} />

                {isLoading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading files...</span>
                    </div>
                ) : files.length > 0 ? (
                    <div className="flex flex-row flex-wrap justify-center sm:justify-start mt-[1rem] gap-4 md:gap-6 lg:gap-8">
                        {files.map((file) => (
                            <FileReportCard
                                key={file.id}
                                file={file}
                                onDelete={handleFileDelete}
                                onEdit={handleFileEdit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center mt-10">
                        <div className="text-center">
                            <img
                                src="/a0473dc5d3d2626bc5c1a17247f22fc646b00472.jpg"
                                alt="Empty folder"
                                className="w-[40%] md:w-[30%] lg:w-[30%] mx-auto"
                            />
                            <div className='mt-[-10px] md:mt-[-30px] md:ml-[1rem] lg:ml-[2rem]'>
                                <h2 className="text-lg font-semibold mt-4 sm:text-2xl">
                                    {selectedCategoryId === null ? 'This Folder is empty' : 'No files in this category'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedCategoryId === null
                                        ? 'Tap the + button to upload a file.'
                                        : 'Try selecting a different category or upload new files.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {showPopup && (
                    <UploadPopup
                        onClose={() => setShowPopup(false)}
                        onUploadSuccess={handleUploadSuccess}
                        folderId={folderId}
                    />
                )}
            </div>
            <ToastContainer />
        </MasterHome>
    );
}

interface UploadPopupProps {
    onClose: () => void;
    onUploadSuccess: () => void;
    folderId: number | null;
}

interface UploadFileItem {
    file: File;
    fileName: string;
    previewImage: string;
    datets: string;
    category: string;
}

const UploadPopup: React.FC<UploadPopupProps> = ({ onClose, onUploadSuccess, folderId }) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip'];

    const isValidExtension = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        return ext && allowedExtensions.includes(ext);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => isValidExtension(file.name));
        const invalidFiles = files.filter((file) => !isValidExtension(file.name));

        const newFiles: UploadFileItem[] = validFiles.map((file) => ({
            file,
            fileName: file.name,
            previewImage: URL.createObjectURL(file),
            datets: new Date().toISOString(),
            category: '',
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        if (invalidFiles.length > 0) {
            toast.error("Only .pdf, .jpg, .jpeg, .png, and .zip files are allowed.");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []);
        const validFiles = files.filter((file) => isValidExtension(file.name));
        const invalidFiles = files.filter((file) => !isValidExtension(file.name));

        const newFiles: UploadFileItem[] = validFiles.map((file) => ({
            file,
            fileName: file.name,
            previewImage: URL.createObjectURL(file),
            datets: new Date().toISOString(),
            category: '',
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        if (invalidFiles.length > 0) {
            toast.error("Only .pdf, .jpg, .jpeg, .png, and .zip files are allowed.");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleNameChange = (index: number, newName: string) => {
        setUploadedFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, fileName: newName } : f))
        );
    };

    const handleCategoryChange = (index: number, category: string) => {
        setUploadedFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, category } : f))
        );
    };

    const handleRemove = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number): string => {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem('userId');
            if (!encryptedUserId) return 0;
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error('Error getting userId:', error);
            return 0;
        }
    };

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) {
            toast.error('Please select at least one file to upload.');
            return;
        }

        // Check if all files have categories
        const filesWithoutCategory = uploadedFiles.filter(file => !file.category);
        if (filesWithoutCategory.length > 0) {
            toast.error('Please select a category for all files.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();

        uploadedFiles.forEach((fileItem, index) => {
            formData.append(`Reports[${index}].reportName`, fileItem.fileName);
            formData.append(`Reports[${index}].reportType`, fileItem.category);
            formData.append(`Reports[${index}].reportFile`, fileItem.file);
        });

        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                toast.error('Please log in to upload reports.');
                return;
            }

            if (!folderId) {
                toast.error('No folder selected.');
                return;
            }

            const response = await UploadeBatch(currentUserId, folderId, formData);
            toast.success(response?.data?.message);
            onUploadSuccess();
        } catch (error: any) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]"
            onClick={onClose}
        >
            <div
                className="relative w-[95%] max-w-md md:max-w-[40rem] border border-gray-300 rounded-lg bg-[#EFF5FF] px-6 py-6 shadow-md overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onClose}
                    disabled={isUploading}
                >
                    &times;
                </button>

                <h2 className="text-center text-[#0331B5] font-semibold text-lg md:text-[20px] mb-2">
                    Upload Reports to This Folder
                </h2>
                <hr className="w-[47%] md:w-[34%] mt-[-7px] mx-auto h-[2px] bg-[#0331b5] border-none" />

                <p className="text-center text-gray-600 text-sm md:text-[16px] mb-4 mt-3">
                    You can upload multiple reports at once.
                    <br />
                    Give each file a name and choose the right category before saving.
                </p>

                {/* Dropzone */}
                <div
                    className="border-2 border-dashed max-w-[550px] mx-auto border-gray-300 rounded-md p-6 mb-4 flex flex-col items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <img
                        src="/9d3b1e529ff482abe61dba009ba6478444538807.png"
                        alt="Upload Illustration"
                        className="w-24 h-24 md:w-48 md:h-48 mb-4"
                    />
                    <p className="text-sm md:text-[17px] text-center">
                        <span className="text-[#0331B5] font-semibold cursor-pointer hover:underline">
                            Drag and drop
                        </span>{' '}
                        your reports here
                    </p>
                </div>

                <p className="text-sm md:text-[17px] text-gray-600 text-center mb-4">or</p>

                <div className="flex justify-center">
                    <label className="bg-[#F9E380] hover:bg-[#ffd100] text-[#333] font-semibold px-8 py-3 rounded-md inline-flex items-center gap-2 cursor-pointer shadow">
                        <i className="fa fa-upload text-lg"></i>
                        Upload
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {/* File Preview */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {uploadedFiles.map((fileItem, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 bg-white border border-gray-300 p-4 rounded-md shadow-sm"
                            >
                                <img
                                    src={fileItem.previewImage}
                                    alt="Preview"
                                    className="w-14 h-16 object-cover border"
                                />
                                <div className="flex-1">
                                    <p className="text-xs text-black mb-1">Click to rename file</p>
                                    <input
                                        type="text"
                                        value={fileItem.fileName}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className="w-full font-semibold text-blue-700 border border-gray-300 rounded-md px-2 py-1"
                                        disabled={isUploading}
                                    />
                                    <select
                                        value={fileItem.category}
                                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                                        className="w-full mt-2 border border-gray-300 rounded-md px-2 py-1"
                                        disabled={isUploading}
                                    >
                                        <option value="">Select Report Category</option>
                                        <option value="Lab Report">Lab Report</option>
                                        <option value="Dental Report">Dental Report</option>
                                        <option value="Immunization">Immunization</option>
                                        <option value="Medications/Prescription">Medications/Prescription</option>
                                        <option value="Radiology">Radiology</option>
                                        <option value="Ophthalmology">Ophthalmology</option>
                                        <option value="Special Report">Special Report</option>
                                        <option value="Invoices/Mediclaim Insurance">Invoices/Mediclaim Insurance</option>
                                    </select>
                                </div>
                                <div className="text-xs text-black">
                                    {formatFileSize(fileItem.file.size)}
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="text-red-600 hover:text-red-800 mt-4"
                                    disabled={isUploading}
                                >
                                    <span className="text-xl">⊖</span> Remove
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || uploadedFiles.length === 0}
                                className="bg-[#0331B5] hover:bg-[#022e9f] text-white font-semibold px-6 py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    'Save Reports'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};