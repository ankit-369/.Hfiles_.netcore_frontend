'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, FileText, Edit, Trash2, Share2 } from 'lucide-react';
import MasterHome from '../components/MasterHome';
import { ListReport, DeleteReport, MemberList, ReportEdit } from '../services/HfilesServiceApi';
import { toast, ToastContainer } from 'react-toastify';
import { decryptData } from '../utils/webCrypto';

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
            toast.error("Failed to update report. Please try again.");
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

    return (
        <MasterHome>
            <div className="min-h-[calc(100vh-140px)] bg-gray-50 p-6">
                {/* Header */}
                <div className="mb-6 ">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.push('/myHfiles')}
                            className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Report
                        </button>
                    </div>
                    <h1 className="text-2xl flex justify-center font-bold">
                        <span className="text-blue-800">{userNames}'s&nbsp;</span>
                        <span className="text-black">Reports</span>
                    </h1>

                    <div className='border mt-2 mx-auto w-30'></div>
                    <p className="text-gray-600 mt-1">
                        {totalReportsCount} report{totalReportsCount !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Reports Grid */}
                {reports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    {renderFilePreview(report)}
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-900 truncate text-lg">
                                            {report.reportName}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium">
                                            {report.reportType}
                                        </p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Size:</span> {formatFileSize(report.fileSize)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Type:</span> {report.userType}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Date:</span> {report.reportDate} {report.reportTime}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2">
                                        <button
                                            onClick={() => handleView(report)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 cursor-pointer primary text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(report)}
                                            className="flex items-center justify-center px-2 py-2 text-yellow-500 cursor-pointer text-sm rounded-lg  transition-colors"
                                            title="Edit Report"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(report)}
                                            disabled={isDeleting === report.id}
                                            className={`flex items-center justify-center px-2 py-2 text-sm rounded-lg transition-colors ${isDeleting === report.id
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-red-500 cursor-pointer hover:bg-red-50'
                                                }`}
                                            title="Delete Report"
                                        >
                                            {isDeleting === report.id ? (
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleWhatsAppShare(report)}
                                            className="flex items-center justify-center px-2 py-2 text-green-500 cursor-pointer text-sm rounded-lg  transition-colors"
                                            title="Share on WhatsApp"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20.52 3.48A11.91 11.91 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.7 6.1L0 24l6.3-1.66A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12a11.91 11.91 0 00-3.48-8.52zM12 22a9.93 9.93 0 01-5.27-1.52l-.38-.23-3.74.99 1-3.64-.24-.38A9.95 9.95 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.19-7.56c-.28-.14-1.65-.81-1.9-.9s-.44-.14-.63.14-.72.9-.89 1.08-.33.21-.61.07a8.3 8.3 0 01-2.45-1.5 9.27 9.27 0 01-1.71-2.12c-.18-.3 0-.46.13-.6.13-.13.3-.33.45-.49.15-.17.2-.28.3-.47s.05-.35-.03-.49c-.08-.14-.63-1.51-.87-2.07-.23-.55-.47-.48-.64-.49h-.54c-.17 0-.45.07-.69.35s-.91.89-.91 2.16.93 2.5 1.06 2.67c.13.17 1.84 2.81 4.46 3.94 1.67.72 2.32.79 3.15.67.51-.08 1.65-.68 1.88-1.34s.23-1.23.16-1.34c-.06-.1-.26-.17-.54-.3z" />
                                            </svg>
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

                        <input
                            type="text"
                            value={editedReportName}
                            onChange={(e) => setEditedReportName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new report name"
                        />

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