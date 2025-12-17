import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { editPetImage } from './services/geminiService';
import { AppStatus, GeneratedImage } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedImage) return;
    if (!prompt.trim()) {
      setErrorMsg("لطفا تغییری که می‌خواهید را بنویسید");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      // Enhance prompt to ensure the model understands the context of pet grooming styling
      const enhancedPrompt = `
      این یک تصویر از یک سگ است. 
      وظیفه: اعمال تغییرات آرایشی زیر روی سگ در تصویر با حفظ واقع گرایی: "${prompt}".
      مطمئن شو که عکس نهایی طبیعی به نظر برسد و فقط قسمت خواسته شده (مثل رنگ دم یا گوش) تغییر کند.
      Return the edited image directly.
      `;

      const result = await editPetImage(selectedImage, enhancedPrompt);
      setResultImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("متاسفانه مشکلی در ارتباط با هوش مصنوعی پیش آمد. لطفا دوباره تلاش کنید.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResultImage(null);
    setPrompt('');
    setErrorMsg(null);
    // Keep selected image for convenience
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-right relative overflow-hidden">
      
      {/* Background Decorative Elements (Certificate Style) */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-gold-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl opacity-10 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-1 border-2 border-gold-300 rounded-full mb-4 bg-white shadow-md">
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-2">
             استایلیست پت <span className="text-gradient-gold">نانو بنانا</span>
          </h1>
          <p className="text-gray-500 text-lg">
            گواهی زیبایی و رنگ آمیزی اختصاصی حیوان خانگی شما
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gold-200 overflow-hidden relative">
           {/* Top Gold Bar */}
           <div className="h-2 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>

           <div className="p-6 sm:p-10">
              
              {status === AppStatus.SUCCESS && resultImage ? (
                <div className="animate-fade-in space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-serif text-gold-600 font-bold mb-6">✨ نتیجه طراحی شما ✨</h2>
                    <div className="relative rounded-2xl overflow-hidden shadow-gold border-4 border-gold-100 inline-block max-w-full">
                       <img 
                        src={`data:${resultImage.mimeType};base64,${resultImage.data}`} 
                        alt="Edited Pet" 
                        className="max-h-[500px] w-auto mx-auto object-contain"
                      />
                      {/* Watermark/Seal */}
                      <div className="absolute bottom-4 right-4 w-20 h-20 bg-gold-400 rounded-full flex items-center justify-center shadow-lg opacity-80">
                         <div className="text-[10px] text-white font-bold text-center leading-tight">
                            تایید شده<br/>توسط<br/>نانو بنانا
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={handleReset} className="bg-gray-100 !from-gray-500 !via-gray-400 !to-gray-600">
                      طراحی جدید
                    </Button>
                    <a 
                      href={`data:${resultImage.mimeType};base64,${resultImage.data}`} 
                      download="pet-glamour-style.png"
                      className="w-full"
                    >
                      <Button>دانلود تصویر</Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Upload Section */}
                  <div className="space-y-3">
                    <label className="block text-gray-700 font-bold text-lg border-r-4 border-gold-400 pr-3">
                      ۱. عکس پت خود را انتخاب کنید
                    </label>
                    <ImageUpload 
                      selectedImage={selectedImage} 
                      onImageSelect={setSelectedImage} 
                    />
                  </div>

                  {/* Prompt Section */}
                  <div className="space-y-3">
                    <label className="block text-gray-700 font-bold text-lg border-r-4 border-gold-400 pr-3">
                      ۲. چه تغییری مد نظر شماست؟
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="مثلا: دم سگم رو صورتی کن یا گوش‌هاش رو سبز یشمی کن..."
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-gold-400 focus:ring-4 focus:ring-gold-100 outline-none transition-all text-gray-700 placeholder-gray-400 bg-paper"
                        disabled={status === AppStatus.PROCESSING}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleGenerate} 
                      isLoading={status === AppStatus.PROCESSING}
                      disabled={!selectedImage || !prompt}
                    >
                      مشاهده نتیجه تغییر (جادوی نانو بنانا)
                    </Button>
                  </div>
                </div>
              )}

           </div>

           {/* Bottom Certificate Footer */}
           <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-serif">
              <span>Dated: {new Date().toLocaleDateString('fa-IR')}</span>
              <span className="flex items-center gap-1">
                <span className="h-px w-8 bg-gold-300"></span>
                Pet Beauty Tech
                <span className="h-px w-8 bg-gold-300"></span>
              </span>
           </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Gemini 2.5 Flash Image ("Nano Banana")
        </p>

      </div>
    </div>
  );
};

export default App;