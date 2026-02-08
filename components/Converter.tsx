
import React, { useState, useRef } from 'react';

interface FileState {
  file: File;
}

const FORMAT_MAPPING: Record<string, { label: string; ext: string; icon: string; description: string }[]> = {
  'pdf': [
    { label: 'Word Document', ext: 'DOCX', icon: '📄', description: 'Editable Microsoft Word file' },
    { label: 'Excel Sheet', ext: 'XLSX', icon: '📊', description: 'Extract tables to Excel' },
    { label: 'CSV Data', ext: 'CSV', icon: '📑', description: 'Extract text to raw data' },
    { label: 'PNG Image', ext: 'PNG', icon: '🖼️', description: 'High-quality lossless image' },
    { label: 'JPG Image', ext: 'JPG', icon: '📸', description: 'Compressed photography format' }
  ],
  'docx': [
    { label: 'PDF Document', ext: 'PDF', icon: '📕', description: 'Standard portable document' },
    { label: 'Excel Sheet', ext: 'XLSX', icon: '📊', description: 'Convert tables to Excel' },
    { label: 'CSV Data', ext: 'CSV', icon: '📑', description: 'Convert tables to CSV' }
  ],
  'csv': [
    { label: 'Excel Sheet', ext: 'XLSX', icon: '📊', description: 'Microsoft Excel spreadsheet' },
    { label: 'PDF Report', ext: 'PDF', icon: '📕', description: 'Print-ready PDF layout' }
  ],
  'xlsx': [
    { label: 'PDF Document', ext: 'PDF', icon: '📕', description: 'Fixed layout spreadsheet' },
    { label: 'CSV Data', ext: 'CSV', icon: '📑', description: 'Plain text data file' }
  ],
  'jpg': [
    { label: 'PDF Document', ext: 'PDF', icon: '📕', description: 'Convert image to document' },
    { label: 'PNG Image', ext: 'PNG', icon: '🖼️', description: 'Switch to lossless format' }
  ],
  'jpeg': [
    { label: 'PDF Document', ext: 'PDF', icon: '📕', description: 'Convert image to document' },
    { label: 'PNG Image', ext: 'PNG', icon: '🖼️', description: 'Switch to lossless format' }
  ],
  'png': [
    { label: 'PDF Document', ext: 'PDF', icon: '📕', description: 'Convert image to document' },
    { label: 'JPG Image', ext: 'JPG', icon: '📸', description: 'Convert to compressed JPG' }
  ],
};

export const Converter: React.FC = () => {
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<{ message: string; type?: 'connection' | 'other' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPossibleFormats = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return FORMAT_MAPPING[ext] || [];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formats = getPossibleFormats(selectedFile.name);
      if (formats.length === 0) {
        setError({ message: 'Unsupported file type. Please upload PDF, DOCX, CSV, Excel, or Images.' });
        setFileState(null);
        return;
      }
      setError(null);
      setFileState({ file: selectedFile });
      setTargetFormat(formats[0].ext);
      setDownloadUrl(null);
      setIsSimulated(false);
    }
  };

  const startSimulation = async () => {
    setIsConverting(true);
    setError(null);
    setIsSimulated(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a dummy blob of the correct "type"
    const dummyContent = `Simulated ${targetFormat} content for ${fileState?.file.name}`;
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    
    setDownloadUrl(url);
    setIsConverting(false);
  };

  const handleConvert = async () => {
    if (!fileState) return;

    setIsConverting(true);
    setError(null);
    setIsSimulated(false);

    const formData = new FormData();
    formData.append('file', fileState.file);
    formData.append('target_format', targetFormat);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/convert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        setError({ 
          message: 'Backend server is not reachable.', 
          type: 'connection' 
        });
      } else {
        setError({ message: err.message || 'An unexpected error occurred.' });
      }
    } finally {
      setIsConverting(false);
    }
  };

  const reset = () => {
    setFileState(null);
    setTargetFormat('');
    setDownloadUrl(null);
    setError(null);
    setIsSimulated(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-effect rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all">
      {!fileState ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/50 group-hover:to-white/0 transition-all"></div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.xlsx,.csv,.jpg,.jpeg,.png"
          />
          <div className="relative z-10">
            <div className="bg-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a file to convert</h2>
            <p className="text-gray-500 text-lg max-w-sm mx-auto">Drop your PDF, Word, or images here to start the magic.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* File Header */}
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-2xl">
                📂
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg truncate max-w-[200px] sm:max-w-md">{fileState.file.name}</p>
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-tighter">
                  {fileState.file.name.split('.').pop()} • {(fileState.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button onClick={reset} className="p-3 hover:bg-white hover:text-red-500 text-gray-400 rounded-full transition-all border border-transparent hover:border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Format Selection Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">1. Choose Output Format</h3>
              <div className="h-px flex-grow mx-4 bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPossibleFormats(fileState.file.name).map(fmt => (
                <button
                  key={fmt.ext}
                  onClick={() => { setTargetFormat(fmt.ext); setDownloadUrl(null); setError(null); }}
                  className={`relative overflow-hidden group p-5 rounded-3xl border-2 text-left transition-all ${
                    targetFormat === fmt.ext 
                    ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100 ring-4 ring-indigo-600/5' 
                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl transition-transform group-hover:scale-110 ${targetFormat === fmt.ext ? 'scale-110' : ''}`}>
                      {fmt.icon}
                    </div>
                    <div>
                      <p className={`font-bold ${targetFormat === fmt.ext ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {fmt.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">.{fmt.ext.toLowerCase()}</p>
                    </div>
                  </div>
                  {targetFormat === fmt.ext && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 text-gray-400 font-medium">
               <span className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-xs font-bold">2</span>
               <span>Confirm and convert</span>
            </div>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
              {!downloadUrl ? (
                <button 
                  onClick={handleConvert}
                  disabled={isConverting}
                  className={`relative w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-white transition-all shadow-2xl text-xl overflow-hidden group ${isConverting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}`}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    {isConverting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Working...
                      </>
                    ) : 'CONVERT FILE'}
                  </div>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                   <button onClick={reset} className="px-8 py-5 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all text-lg">
                    New Task
                  </button>
                  <a 
                    href={downloadUrl} 
                    download={`converted_${fileState.file.name.split('.')[0]}.${targetFormat.toLowerCase().replace('xlsx', 'xlsx')}`}
                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-2xl shadow-emerald-100 flex items-center justify-center text-xl"
                  >
                    <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    DOWNLOAD NOW
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Handling & Simulation Mode */}
      {error && (
        <div className="mt-8 space-y-4">
          <div className="p-5 bg-red-50 border-2 border-red-100 rounded-3xl flex items-start space-x-4">
            <div className="p-2 bg-red-100 rounded-xl text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-grow">
              <span className="text-red-900 font-black block text-lg mb-1">Server Connection Failed</span>
              <p className="text-sm text-red-700 leading-relaxed">
                The conversion engine at <code>localhost:8000</code> is offline. 
                You can start the Python backend locally, or use our **Simulation Mode** below to test the interface.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-xl mb-2 flex items-center">
                    🚀 Run Sim Mode
                  </h4>
                  <p className="text-indigo-100 text-sm mb-6">Test the UI, formats, and download flow immediately without any backend setup.</p>
                </div>
                <button 
                  onClick={startSimulation}
                  disabled={isConverting}
                  className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  {isConverting ? 'Generating...' : 'Start Simulation'}
                </button>
             </div>

             <div className="p-6 bg-white border-2 border-gray-100 rounded-3xl flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-xl text-gray-900 mb-2">
                    🛠️ Start Backend
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">Run these commands in your project folder to enable real conversion.</p>
                  <div className="bg-gray-900 rounded-xl p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                    cd backend && python main.py
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 italic text-center">Server usually runs on port 8000</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
