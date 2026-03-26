import React, { useState } from 'react';
import { UploadCloud, Briefcase, CheckCircle, ArrowRight, FileText, X } from 'lucide-react';

export default function ScreenUpload({ onGenerate }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [userRequest, setUserRequest] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove, e) => {
    e.preventDefault();
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="h-full bg-transparent flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-[#0B1437] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="text-[#0075FF]" />
              <span className="font-bold text-xl tracking-wide text-white">BrandFlow AI</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Khởi Tạo Chiến Dịch B2B</h1>
            <p className="text-[#A0AEC0] text-sm leading-relaxed mb-6">Xin chào! Cung cấp tài liệu và yêu cầu của bạn, AI Agents của chúng tôi sẽ tự động tranh luận và chốt phương án tối ưu ROI nhất.</p>
          </div>
          <div className="bg-[#111C44] rounded-xl p-4 border border-[#1B254B]">
            <span className="text-xs text-[#0075FF] font-bold uppercase tracking-wider block mb-2">Automated Roles</span>
            <ul className="text-sm text-[#A0AEC0] space-y-2">
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-emerald-400"/> CMO (Growth Planner)</li>
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-rose-400"/> CFO (Risk Controller)</li>
            </ul>
          </div>
        </div>
        
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          
          <div className="mb-5">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Tên Chiến Dịch</label>
            <input 
              type="text" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
              placeholder="Nhập tên chiến dịch của bạn..."
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Tài Liệu Cốt Lõi (Guideline/Brief)</label>
            {/* Vùng Drop/Select luôn hiển thị */}
            <label className="border-2 border-dashed border-[#1B254B] rounded-xl p-6 flex flex-col items-center justify-center text-[#A0AEC0] hover:bg-[#1B254B]/50 hover:border-[#0075FF] transition-colors cursor-pointer relative overflow-hidden bg-[#0B1437] mb-4">
              <input type="file" multiple className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0" onChange={handleFileChange} />
              <UploadCloud size={32} className="text-[#0075FF] mb-2" />
              <p className="text-sm font-medium text-white">Kéo thả hoặc nhấn để Upload tài liệu</p>
              <p className="text-xs mt-1 text-[#A0AEC0]">Quét chọn nhiều file PDF, DOCX (Max 10MB)</p>
            </label>

            {/* Danh sách file hiển thị */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="border border-[#1B254B] bg-[#0B1437] rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="bg-[#111C44] p-2 rounded-lg shrink-0 flex items-center justify-center">
                        <FileText className="text-[#0075FF] w-4 h-4" />
                      </div>
                      <div className="truncate pr-4">
                        <p className="text-sm font-bold text-white truncate">{file.name}</p>
                        <p className="text-xs text-[#A0AEC0] font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={(e) => removeFile(idx, e)} className="text-[#A0AEC0] hover:text-rose-500 shrink-0 p-1.5 hover:bg-[#111C44] rounded-full transition-colors" title="Xóa file">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Component nhập Website URL */}
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Đính kèm Link Website (URL)</label>
              <input 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
                placeholder="Dán đường dẫn bài viết hoặc tên miền website tham khảo..."
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Mô Tả Chuyên Sâu & Yêu Cầu Của Bạn</label>
            <textarea 
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
              rows="4" 
              placeholder="Điền các luồng yêu cầu, nhóm đối tượng, hoặc mô tả chi tiết chiến dịch..."
            />
          </div>

          <button 
            onClick={() => onGenerate(selectedFiles, urlInput, campaignName, userRequest)}
            className="w-full py-4 bg-[#0075FF] hover:bg-[#0055c4] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(0,117,255,0.4)]"
          >
            Giao Việc Cho Agents <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
