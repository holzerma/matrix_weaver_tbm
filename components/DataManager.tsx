
import React, { useRef } from 'react';
import { AppData } from '../types';
import Card from './common/Card';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';

interface DataManagerProps {
    onImport: (data: AppData) => void;
    onExport: () => AppData;
    className?: string;
}

const DataManager: React.FC<DataManagerProps> = ({ onImport, onExport, className = '' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = onExport();
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `value_stream_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const parsedData = JSON.parse(text);
                        // Basic validation
                        if (parsedData.employees && parsedData.valueStreams && parsedData.competences && parsedData.costPools) {
                            onImport(parsedData);
                        } else {
                            alert('Invalid data file format. Required fields are missing.');
                        }
                    }
                } catch (error) {
                    alert('Error parsing data file.');
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        }
        // Reset file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card className={`mt-8 ${className}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Data Management</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Save your current setup or load a previous configuration.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button onClick={handleImportClick} className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg shadow-md hover:bg-slate-700 transition-colors">
                        <UploadIcon className="w-5 h-5" />
                        <span>Import JSON</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        <DownloadIcon className="w-5 h-5" />
                        <span>Export JSON</span>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default DataManager;
