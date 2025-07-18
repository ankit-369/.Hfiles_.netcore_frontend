'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, FileText, Edit, Trash2, Share2, MoreVertical } from 'lucide-react';
import MasterHome from '../components/MasterHome';
import { ListReport, DeleteReport, MemberList, ReportEdit, ReportShare } from '../services/HfilesServiceApi';
import { toast, ToastContainer } from 'react-toastify';
import { decryptData } from '../utils/webCrypto';
import VaccinationList from '../components/VaccinationList';

type Report = {
    userName(userName: any): unknown;
    id: number;
    userId: number;
    reportName: string;
    reportType: string;
    reportUrl: string;
    fileSize: number;
    userType: string;
    uploadedBy: string;
    reportTime: string;
    reportDate: string;
};

type ApiResponse = {
    success: boolean;
    data: {
        mainUserReportsCount: number;
        dependentUserReportsCounts: any[];
        totalReportsCount: number;
        reports: Report[];
    };
    message: string;
};

const ReportsPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [userId, setUserId] = useState<number>(0);
    const [reportType, setReportType] = useState<string>('');
    const [totalReportsCount, setTotalReportsCount] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentReport, setCurrentReport] = useState<Report | null>(null);
    const [editedReportName, setEditedReportName] = useState('');
    const [userNames, setUserNames] = useState() as any;
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
    const [independent, setIndependent] = useState() as any;
    const [selectedIndependentIds, setSelectedIndependentIds] = useState<number[]>([]);
    const [reportAccessMap, setReportAccessMap] = useState<Record<number, number[]>>({});
    const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set());
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [shareData, setShareData] = useState<{
        shareUrl: string;
        expiryDate: string;
        expiryTime: string;
    } | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'edit' | 'access' | null>(null);



    const toggleDropdown = (id: any) => {
        setOpenDropdownId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        const reportTypeParam = searchParams.get('reportType');

        if (userIdParam && reportTypeParam) {
            setUserId(parseInt(userIdParam));
            setReportType(decodeURIComponent(reportTypeParam));
            fetchReports(parseInt(userIdParam), decodeURIComponent(reportTypeParam));
        } else {
            toast.error("Missing required parameters");
            router.push('/myHfiles');
        }
    }, [searchParams]);

    const fetchReports = async (userId: number, reportType: string) => {
        try {
            const response = await ListReport(userId, reportType);

            if (response && response.data && response.data.success) {
                const apiResponse: ApiResponse = response.data;
                setReports(apiResponse.data.reports || []);
                setTotalReportsCount(apiResponse.data.totalReportsCount || 0);
                setUserNames(apiResponse.data.reports[0].userName)

            } else {
                setReports([]);
                setTotalReportsCount(0);
                toast.info("No reports found for this category");
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            setReports([]);
            setTotalReportsCount(0);
        } finally {
        }
    };

    const handleView = (report: Report) => {
        if (report.reportUrl) {
            window.open(report.reportUrl, '_blank');
        } else {
            toast.error("File URL not available");
        }
    };

    const handleEdit = (report: Report) => {
        setModalType('edit');
        setCurrentReport(report);
        setEditedReportName(report.reportName);
        const savedAccessIds = reportAccessMap[report.id] || [];
        setSelectedIndependentIds(savedAccessIds);

        setIsEditModalOpen(true);
    };

    const handleDelete = (report: Report) => {
        setReportToDelete(report);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!reportToDelete) return;

        setIsDeleting(reportToDelete.id);
        setIsDeleteModalOpen(false);

        try {
            const response = await DeleteReport(reportToDelete.id);
            if (response && response.data.message) {
                setReports(prev => prev.filter(r => r.id !== reportToDelete.id));
                setTotalReportsCount(prev => prev - 1);
                toast.success(`${response.data.message}`);
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Failed to delete report. Please try again.");
        } finally {
            setIsDeleting(null);
            setReportToDelete(null);
        }
    };

    const handleWhatsAppShare = (report: Report) => {
        if (report.reportUrl) {
            const message = `Check out this ${report.reportType}: ${report.reportName}`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + ' ' + report.reportUrl)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            toast.error("File URL not available");
        }
    };

    const formatFileSize = (sizeInKB: number) => {
        if (sizeInKB < 1024) {
            return `${sizeInKB.toFixed(2)} KB`;
        } else {
            return `${(sizeInKB / 1024).toFixed(2)} MB`;
        }
    };

    const getFileIcon = (reportUrl?: string) => {
        if (!reportUrl) return <FileText className="w-8 h-8 text-gray-500" />;

        const fileExtension = reportUrl.split('.').pop()?.toLowerCase();

        switch (fileExtension) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileText className="w-8 h-8 text-green-500" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-8 h-8 text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <FileText className="w-8 h-8 text-green-600" />;
            default:
                return <FileText className="w-8 h-8 text-gray-500" />;
        }
    };

    const isImageFile = (reportUrl: string) => {
        const fileExtension = reportUrl.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension || '');
    };

    const renderFilePreview = (report: Report) => {
        if (isImageFile(report.reportUrl)) {
            return (
                <div className="w-full h-80 mb-4 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    <img
                        src={report.reportUrl}
                        alt={report.reportName}
                        className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                        onClick={() => handleView(report)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <div className="hidden w-full h-full  items-center justify-center">
                        {getFileIcon(report.reportUrl)}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="w-full h-32 mb-4 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleView(report)}>
                    <div className="text-center">
                        {getFileIcon(report.reportUrl)}
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            {report.reportUrl.split('.').pop()?.toUpperCase() || 'FILE'}
                        </p>
                    </div>
                </div>
            );
        }
    };

    const handleSaveEdit = async () => {
        if (!currentReport) return;

        const payload = {
            reportName: editedReportName,
            accessUpdates: selectedIndependentIds.map(memberId => ({
                independentUserId: memberId,
                accessStatus: true
            }))
        };

        try {
            const response = await ReportEdit(currentReport.id, payload);
            if (response && response.data && response.data.success) {
                const updatedReports = reports.map((r) =>
                    r.id === currentReport.id ? { ...r, reportName: editedReportName } : r
                );
                setReports(updatedReports);
                setReportAccessMap(prev => ({
                    ...prev,
                    [currentReport.id]: [...selectedIndependentIds]
                }));

                toast.success(response.data.message);
            } else {
                toast.error(response?.data?.message);
            }

            setIsEditModalOpen(false);
            setSelectedIndependentIds([]);
            setCurrentReport(null);
            setEditedReportName('');

        } catch (error) {
            console.error("Error updating report:", error);
        }
    };
    const getUserId = async (): Promise<number> => {
        try {
            const encryptedUserId = localStorage.getItem("userId");
            if (!encryptedUserId) {
                return 0;
            }
            const userIdStr = await decryptData(encryptedUserId);
            return parseInt(userIdStr, 10);
        } catch (error) {
            console.error("Error getting userId:", error);
            return 0;
        }
    };

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
        }
    };

    useEffect(() => {
        ListMember();
    }, [])

    const handleCheckboxChange = (memberId: number) => {
        setSelectedIndependentIds((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectReport = (reportId: number) => {
        const newSelected = new Set(selectedReports);
        if (newSelected.has(reportId)) {
            newSelected.delete(reportId);
        } else {
            newSelected.add(reportId);
        }
        setSelectedReports(newSelected);
    };


    const handleShare = async () => {
        if (selectedReports.size === 0) {
            toast.error("Please select at least one report to share.");
            return;
        }

        setIsSharing(true);

        try {
            const payload = {
                reportIds: Array.from(selectedReports)
            };

            const response = await ReportShare(payload);

            if (response && response.data && response.data.success) {
                setShareData({
                    shareUrl: response.data.data.shareUrl,
                    expiryDate: response.data.data.expiryDate,
                    expiryTime: response.data.data.expiryTime
                });
                setIsShareModalOpen(true);
                toast.success(response.data.message);
            } else {
                toast.error("Failed to create share link. Please try again.");
            }
        } catch (error) {
            console.error("Error creating share link:", error);
        } finally {
            setIsSharing(false);
        }
    };


    const handleAccess = (report: Report) => {
        setModalType('access');
        setCurrentReport(report);
        const savedAccessIds = reportAccessMap[report.id] || [];
        setSelectedIndependentIds(savedAccessIds);
        setIsEditModalOpen(true);
    };


    return (
        <MasterHome>
            <div className="min-h-[calc(100vh-140px)] bg-gray-50 p-2">
                {/* Header */}
                <div className="mb-6 ">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.push('/myHfiles')}
                            className="flex items-center text-black cursor-pointer hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                    </div>
                    <h1 className="text-2xl flex justify-center font-bold">
                        <span className="text-blue-800">{userNames}'s&nbsp;</span>
                        <span className="text-gray-500">{reportType} Reports</span>
                    </h1>

                    <div className='border mt-2 mx-auto w-30'></div>
                    <p className="text-gray-600 mt-1">
                        {totalReportsCount} report{totalReportsCount !== 1 ? 's' : ''} found
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${selectedReports.size > 0
                            ? 'hover:bg-gray-50 text-gray-900'
                            : 'text-gray-400 cursor-not-allowed'
                            } ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSharing ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                            <Share2 size={16} />
                        )}
                        <span>
                            Share {selectedReports.size > 0 ? `(${selectedReports.size})` : ''}
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            if (selectedReports.size > 0) {
                                const firstReportId = Array.from(selectedReports)[0];
                                const firstReport = reports.find((report) => report.id === firstReportId);
                                if (firstReport) handleAccess(firstReport);
                            } else {
                                toast.error("Please select at least one report to access.");
                            }
                        }}
                        disabled={selectedReports.size === 0} // Disable button if no reports are selected
                        className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${selectedReports.size > 0
                            ? 'hover:bg-gray-50 text-gray-900'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Access
                    </button>
                    <button
                        onClick={() => router.push('/myHfiles')}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors"
                    >
                        Add Report
                    </button>

                </div>
                {reportType === 'IMMUNIZATION' &&
                    <div>
                        <VaccinationList />
                    </div>
                }


                {/* Reports Grid */}
                {reports.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-3">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className={`bg-white rounded-lg shadow-sm border transition-all ${selectedReports.has(report.id)
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {/* Checkbox */}
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selectedReports.has(report.id)}
                                        onChange={() => handleSelectReport(report.id)}
                                        className="absolute top-3 left-3 w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 z-10 shadow-sm"
                                    />

                                    {/* Report Preview */}
                                    <div className="aspect-[4/3] bg-gray-100 rounded-t-lg border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                                        {report.reportUrl ? (
                                            report.reportUrl.toLowerCase().endsWith('.pdf') ? (
                                                <img
                                                    src="/vecteezy_pdf-png-icon-red-and-white-color-for_23234824.png"
                                                    alt="PDF File"
                                                    className="object-contain w-full h-full"
                                                />
                                            ) : (
                                                <img
                                                    src={report.reportUrl}
                                                    alt="Report Preview"
                                                    className="object-contain w-full h-full"
                                                />
                                            )
                                        ) : (
                                            <span className="text-gray-400">No Preview Available</span>
                                        )}
                                    </div>
                                </div>

                                {/* Report Metadata */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-blue-800 mb-2 truncate text-lg flex-1">
                                            {report.reportName}
                                        </h3>
                                        <div className="relative dropdown-menu">
                                            <button
                                                onClick={() => toggleDropdown(report.id)}
                                                className="p-2 rounded-full hover:bg-gray-100"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                            </button>
                                            {openDropdownId === report.id && (
                                                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50 border">
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(report);
                                                            setOpenDropdownId(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleWhatsAppShare(report);
                                                            setOpenDropdownId(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                    >
                                                        <Share2 size={14} /> Share
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border border-gray-300 mb-2"></div>

                                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                                        <div>
                                            <span className="font-medium">Report Type:</span> {report.reportType}
                                        </div>
                                        <div>
                                            <span className="font-medium">User Type:</span> {report.userType}
                                        </div>
                                        <div>
                                            <span className="font-medium">Date:</span> {report.reportDate} {report.reportTime}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(report)}
                                            className="flex-1 primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => handleEdit(report)}
                                            className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
                                            title="Edit Report"
                                        >
                                            <Edit className="text-yellow-600 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No reports found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            No {reportType.toLowerCase()} reports have been uploaded yet.
                        </p>
                        <button
                            onClick={() => router.push('/myHfiles')}
                            className="inline-flex items-center px-4 py-2 primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4 text-center">Edit Report Name</h2>
                        {modalType === "edit" &&
                            <input
                                type="text"
                                value={editedReportName}
                                onChange={(e) => setEditedReportName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new report name"
                            />
                        }

                        <div>
                            {independent?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Independent Members (optional)
                                    </label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded">
                                        {independent.map((member: any) => (
                                            <label key={member.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIndependentIds.includes(member.id)}
                                                    onChange={() => handleCheckboxChange(member.id)}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {member.firstName} {member.lastName}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveEdit()}
                                className="px-4 py-2 text-sm rounded-md primary text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900">Delete Report</h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{reportToDelete?.reportName}"? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setReportToDelete(null);
                                }}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </MasterHome>
    );
};

export default ReportsPage;