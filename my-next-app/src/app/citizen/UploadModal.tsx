'use client';
import { useState } from 'react';
import { XCircle, Upload } from 'lucide-react';

export default function UploadModal({ 
  showUploadModal, 
  setShowUploadModal, 
  uploading, 
  selectedFiles, 
  documentData, 
  handleFileChange, 
  handleInputChange, 
  uploadDocuments 
}: { 
  showUploadModal: boolean; 
  setShowUploadModal: (show: boolean) => void; 
  uploading: boolean; 
  selectedFiles: FileList | null; 
  documentData: { category: string; description: string }; 
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; 
  uploadDocuments: () => void; 
}) {
  const documentCategories = [
    { id: 'personal', name: 'Personal ID' },
    { id: 'aadhaar', name: 'Aadhaar Card' },
    { id: 'voter', name: 'Voter ID' },
    { id: 'passport', name: 'Passport' },
    { id: 'driving', name: 'Driving Licence' },
    { id: 'pan', name: 'PAN Card' },
    { id: 'ration', name: 'Ration Card' },
    { id: 'residence', name: 'Residence Proof' },
    { id: 'other', name: 'Other Documents' }
  ];

  if (!showUploadModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-[#102542ff]">Upload Documents</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-[#f87060ff] cusror-pointer hover:text-[#e55a4aff]"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-[#6b7280] mb-4">
              Upload your important documents here. You can download them anytime when applying for government schemes.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#102542ff] mb-2">
                Document Category
              </label>
              <select
                name="category"
                value={documentData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
              >
                {documentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#102542ff] mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={documentData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="Add a description for these documents"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#102542ff] mb-2">
                Select Documents
              </label>
              <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-6 text-center bg-[rgba(16,37,66,0.05)] hover:bg-[rgba(16,37,66,0.1)] transition-colors">
                <Upload className="h-10 w-10 mx-auto mb-3 text-[#6b7280]" />
                <p className="text-sm text-[#6b7280] mb-2">Drag and drop files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>
            
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-[#102542ff] mb-2">Selected Files:</h4>
                <ul className="bg-[rgba(16,37,66,0.05)] rounded-lg p-4 max-h-40 overflow-y-auto">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index} className="text-sm text-[#6b7280] mb-1 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#f87060ff] mr-2"></div>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border cusror-pointer border-[#e5e7eb] text-[#102542ff] rounded-lg hover:bg-[rgba(16,37,66,0.05)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={uploadDocuments}
              disabled={uploading || !selectedFiles || selectedFiles.length === 0}
              className="px-4 py-2 bg-[#f87060ff] cusror-pointer hover:bg-[#e55a4aff] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}