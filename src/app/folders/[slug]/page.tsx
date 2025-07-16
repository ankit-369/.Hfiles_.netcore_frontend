"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import DynamicPage from '@/app/components/Header&Footer/DynamicPage';
import Search from '../../components/Search';

interface FileItem {
    fileName: string;
    previewImage: string;
    category: string;
    date: string;
}

const FileReportCard: React.FC<{ file: FileItem }> = ({ file }) => {
    return (

        <div className=" bg-[#EFF5FF] rounded-xl border border-gray-200 shadow-sm min-w-[150px] sm:min-w-[200px] xl:min-w-[210px]">
            <div className="p-2 flex justify-between items-center w-[90%] mx-auto mt-1">
                <span className="text-sm font-semibold text-[#2C3E50] sm:text-[15px]">{file.category}</span>
                {/* <button className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                    <i className="fa fa-ellipsis-v sm:text-lg"></i>
                </button> */}
                <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 space-y-[3px]">
                    <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                    <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                    <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-gray-400 rounded-full"></span>
                </button>
            </div>

            <div className="px-2 mt-1  ">
                <img
                    src={file.previewImage} // update this path
                    alt="Ankit's TSH Test"
                    className="w-[90%] h-[120px] sm:h-[150px] xl:h-[160px] object-cover rounded-md mx-auto"
                />
            </div>

            <div className="p-2 bg-[#F9F9F9] ">
                <div className='w-[90%] mx-auto'>

                    <p className="text-sm sm:text-[15px] font-medium text-gray-800 truncate">
                        {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500">{file.date}</p>
                </div>
            </div>
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


export default function Folders() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const Files: FileItem[] = [
        {
            fileName: "file one",
            previewImage: "data:image/jpeg;base64,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",
            category: "Lab Report",
            date: "3 March, 2025"
        },
        {
            fileName: "sec file",
            previewImage: "data:image/jpeg;base64,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",
            category: "Priscription",
            date: "38 March, 2025"
        },
        {
            fileName: " third file",
            previewImage: "https://images.template.net/wp-content/uploads/2022/11/Medical-Summary-Report.jpg",
            category: "Rediology",
            date: "3 March, 2025"
        }


    ];

    useEffect(() => {
        setFiles(Files); // ✅ Sets the files after component mounts
    }, []);




    return (
        <DynamicPage>
            <div className='Main w-[95%] mx-auto sm:w-[90%]'>

                <Search />

                <div className=''>
                    <div className='flex flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-sm\6 leading-tight'>
                        <span className='text-[#0331B5] font-bold'>Ankit's</span>
                        <span className='text-black font-bold'>Thyroid Report</span>
                    </div>

                    <div className="text-sm md:text-lg text-[#353935] flex items-center space-x-2 mt-1 sm:mt-3 md:justify-end lg:mr-3 md:mt-[-16px]">
                        <span className="font-semibold">Last updated:</span>
                        <span>12 December, 2025</span>
                        <span className="text-gray-400">•</span>
                        <span>0 Reports</span>
                    </div>
                </div>
                <hr className="mt-2 h-[1px] sm:h-[2px] bg-gray-400 border-none" />

                <FloatingActionButton onClick={() => setShowPopup(true)} />

                {files.length > 0 ? (

                    <div className="flex flex-row flex-wrap justify-center sm:justify-start mt-[3rem] gap-4 md:gap-6 lg:gap-8">
                        {files.map((file, index) => (
                            <FileReportCard key={index} file={file} />
                        ))}
                    </div>


                ) : (

                    <div className="flex justify-center mt-10">
                        <div className="text-center">
                            <img src="/error/No_reports_added.png" alt="Empty folder" className="w-[50%] md:w-[40%] lg:w-[33%] mx-auto" />
                            <div className='mt-[-10px] md:mt-[-30px] md:ml-[1rem] lg:ml-[2rem]'>

                                <h2 className="text-lg font-semibold mt-4 sm:text-2xl">This Folder is empty</h2>
                                <p className="text-sm text-gray-500 mt-1">Tap the + button to upload a file.</p>
                            </div>
                        </div>
                    </div>
                )}

                {showPopup && <UploadPopup onClose={() => setShowPopup(false)} />}

            </div>



        </DynamicPage>
    )

}

interface UploadPopupProps {
    onClose: () => void;
}

const UploadPopup: React.FC<UploadPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px] " onClick={onClose}>
            <div className="relative w-[95%] max-w-md md:max-w-[40rem] border border-gray-300 rounded-lg bg-[#EFF5FF] px-6 py-6 shadow-md" onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-center text-[#0331B5] font-semibold text-lg md:text-[20px] mb-2">
                    Upload Reports to This Folder
                </h2>
                <hr className='w-[47%] md:w-[34%] mt-[-7px] mx-auto h-[2px] bg-[#0331b5] border-none' />
                <p className="text-center text-gray-600 text-sm md:text-[16px] mb-4 mt-3">
                    You can upload multiple reports at once.<br />
                    Give each file a name and choose the right category before saving.
                </p>

                {/* Dropzone */}
                <div className="border-2 border-dashed max-w-[550px] mx-auto border-gray-300 rounded-md p-6 mb-4 flex flex-col items-center justify-center">
                    <img
                        src="/error/add_files.png" // <- replace with your image path
                        alt="Upload Illustration"
                        className="w-24 h-24 md:w-48 md:h-48 mb-4"
                    />
                    <p className="text-sm md:text-[17px] text-center">
                        <span className="text-[#0331B5] font-semibold cursor-pointer hover:underline">
                            Drag and drop
                        </span>{" "}
                        your reports here
                    </p>
                </div>

                <p className="text-sm md:text-[17px] text-gray-600 text-center mb-4">or</p>

                {/* Upload Button */}
                <div className="flex justify-center">
                    <label className="bg-[#F9E380] hover:bg-[#ffd100] text-[#333] font-semibold px-8 py-3 rounded-md inline-flex items-center gap-2 cursor-pointer shadow">
                        <i className="fa fa-upload text-lg"></i>
                        Upload
                        <input type="file" className="hidden" multiple />
                    </label>
                </div>
            </div>
        </div>
    );
};

