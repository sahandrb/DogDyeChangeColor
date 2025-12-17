import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    onImageSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={triggerInput}
        className={`
          relative cursor-pointer group rounded-2xl border-2 border-dashed transition-all duration-300
          ${previewUrl ? 'border-gold-400 bg-gold-100/10' : 'border-gold-300 hover:border-gold-500 bg-paper'}
          h-64 flex flex-col items-center justify-center overflow-hidden
        `}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                تغییر عکس
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-100 to-gold-300 flex items-center justify-center shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">برای آپلود عکس کلیک کنید</p>
            <p className="text-gold-500 text-sm">یا عکس سگ خود را اینجا رها کنید</p>
          </div>
        )}
      </div>
    </div>
  );
};