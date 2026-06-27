"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // حالات المودل
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); 

    if (password.length < 6) {
      setErrorMessage("عذراً، كلمة المرور يجب أن تكون 6 خانات على الأقل!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setErrorMessage("عذراً، البريد الإلكتروني أو كلمة المرور غير صحيحة!");
    } else {
      router.push("/RatesPage");
      router.refresh();
    }
    setLoading(false);
  };

  // دالة تحديث كلمة المرور
  const handleUpdatePassword = async () => {
    setModalMessage("");
    if (newPassword.length < 6) {
      setModalMessage("يجب أن تكون كلمة المرور 6 خانات على الأقل!");
      return;
    }
    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setModalMessage("خطأ: " + error.message);
    } else {
      setModalMessage("تم تحديث كلمة المرور بنجاح!");
      setTimeout(() => { setIsModalOpen(false); setNewPassword(""); }, 2000);
    }
    setIsUpdating(false);
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
      <style dangerouslySetInnerHTML={{ __html: `
        input { -webkit-appearance: none; appearance: none; color: #000 !important; }
        @keyframes slideMarquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .dollar-marquee-track { animation: slideMarquee 22s linear infinite; }
        .spinner { border: 2px solid rgba(0,0,0,0.1); border-left-color: #000; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />

      {/* الشريط العلوي المتحرك */}
      <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
        <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
          <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
          <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
        </div>
        <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track" aria-hidden="true">
          <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
          <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
        </div>
      </div> 

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:px-16">
          
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-right space-y-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight max-w-xl">
              مرحبا بكم في شركة <span className="text-[#D4AF37]">الدولار توب</span> للصرافة والدفع الالكتروني
            </h1>

            <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-inner relative overflow-hidden">
                <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-gray-800 text-lg">شركة الدولار توب</h3>
                <p className="text-xs font-bold text-[#C29D2F] mt-0.5">ثقة • سرعة • أمان</p>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 w-full flex flex-col items-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://wa.me/32468133331")}`} 
                  alt="WhatsApp QR"
                  className="w-24 h-24"
                />
                <p className="text-[10px] text-gray-500 mt-2 font-bold">تواصل معنا عبر واتساب</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 flex flex-col">
            <div className="text-center mb-8 border-b border-gray-100 pb-5">
              <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-3 border border-[#D4AF37]/20 shadow-sm">
                <span className="text-3xl">🔑</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">تسجيل الدخول</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900" dir="rtl" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900" dir="ltr" required />
              
              {errorMessage && (
                <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2 disabled:opacity-50">
                {loading ? <span className="spinner"></span> : "تسجيل الدخول"}
              </button>

              <button type="button" onClick={() => router.push("/admin")} className="w-full text-gray-400 hover:text-[#D4AF37] text-sm font-bold transition-colors mt-4 flex items-center justify-center gap-2">
                <span className="underline">دخول المسؤول</span>
              </button>
              
              <button type="button" onClick={() => setIsModalOpen(true)} className="w-full text-gray-400 hover:text-[#D4AF37] text-xs font-bold transition-colors mt-2">
                تحديث كلمة المرور
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* المودل */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl" dir="rtl">
            <h3 className="font-black mb-4">تغيير كلمة المرور</h3>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" className="w-full p-3 border rounded-xl mb-4" />
            {modalMessage && <p className="text-sm font-bold mb-4 text-red-600">{modalMessage}</p>}
            <div className="flex gap-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded-xl text-black font-bold">إغلاق</button>
              <button onClick={handleUpdatePassword} disabled={isUpdating} className="flex-1 bg-[#D4AF37] py-2 rounded-xl font-bold">
                {isUpdating ? <span className="spinner"></span> : "تحديث"}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-4">حقوق نظام تحديث كلمة المرور محفوظة لشركة الدولار توب © 2026</p>
          </div>
        </div>
      )}
    </main>
  );
}
// "use client";

// import  { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   // حالات المودل
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(""); 

//     if (password.length < 6) {
//       setErrorMessage("عذراً، كلمة المرور يجب أن تكون 6 خانات على الأقل!");
//       setLoading(false);
//       return;
//     }

//     const { error } = await supabase.auth.signInWithPassword({
//       email: email.trim(),
//       password: password,
//     });

//     if (error) {
//       setErrorMessage("عذراً، البريد الإلكتروني أو كلمة المرور غير صحيحة!");
//     } else {
//       router.push("/RatesPage");
//       router.refresh();
//     }
//     setLoading(false);
//   };

//   // دالة تحديث كلمة المرور
//   const handleUpdatePassword = async () => {
//     setModalMessage("");
//     if (newPassword.length < 6) {
//       setModalMessage("يجب أن تكون كلمة المرور 6 خانات على الأقل!");
//       return;
//     }
//     setIsUpdating(true);
//     const { error } = await supabase.auth.updateUser({ password: newPassword });
//     if (error) {
//       setModalMessage("خطأ: " + error.message);
//     } else {
//       setModalMessage("تم تحديث كلمة المرور بنجاح!");
//       setTimeout(() => { setIsModalOpen(false); setNewPassword(""); }, 2000);
//     }
//     setIsUpdating(false);
//   };

//   return (
//     <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
//       <style dangerouslySetInnerHTML={{ __html: `
//         input { -webkit-appearance: none; appearance: none; color: #000 !important; }
//         @keyframes slideMarquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
//         .dollar-marquee-track { animation: slideMarquee 22s linear infinite; }
//         .spinner { border: 2px solid rgba(0,0,0,0.1); border-left-color: #000; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}} />

//       {/* الشريط العلوي المتحرك */}
 

//        <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track" aria-hidden="true">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
//       </div> 

//       {/* المحتوى الرئيسي */}
//       <div className="flex-1 flex items-center justify-center p-4 md:p-8">
//         <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:px-16">
          
//           <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-right space-y-8">
//             <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight max-w-xl">
//               مرحبا بكم في شركة <span className="text-[#D4AF37]">الدولار توب</span> للصرافة والدفع الالكتروني
//             </h1>

//             <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
//               <div className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-inner relative overflow-hidden">
//                 <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
//               </div>
//               <div className="text-center">
//                 <h3 className="font-black text-gray-800 text-lg">شركة الدولار توب</h3>
//                 <p className="text-xs font-bold text-[#C29D2F] mt-0.5">ثقة • سرعة • أمان</p>
//               </div>
//               <div className="mt-4 border-t border-gray-100 pt-4 w-full flex flex-col items-center">
//                 <img 
//                   src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://wa.me/32468133331")}`} 
//                   alt="WhatsApp QR"
//                   className="w-24 h-24"
//                 />
//                 <p className="text-[10px] text-gray-500 mt-2 font-bold">تواصل معنا عبر واتساب</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 flex flex-col">
//             <div className="text-center mb-8 border-b border-gray-100 pb-5">
//               <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-3 border border-[#D4AF37]/20 shadow-sm">
//                 <span className="text-3xl">🔑</span>
//               </div>
//               <h2 className="text-2xl font-black text-gray-900 tracking-tight">تسجيل الدخول</h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900" dir="rtl" required />
//               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900" dir="ltr" required />
              
//               {errorMessage && (
//                 <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
//                   {errorMessage}
//                 </p>
//               )}

//               <button type="submit" disabled={loading} className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2 disabled:opacity-50">
//                 {loading ? <span className="spinner"></span> : "تسجيل الدخول"}
//               </button>

//               <button type="button" onClick={() => router.push("/admin")} className="w-full text-gray-400 hover:text-[#D4AF37] text-sm font-bold transition-colors mt-4 flex items-center justify-center gap-2">
//                 <span className="underline">دخول المسؤول</span>
//               </button>
              
//               <button type="button" onClick={() => setIsModalOpen(true)} className="w-full text-gray-400 hover:text-[#D4AF37] text-xs font-bold transition-colors mt-2">
//                 تحديث كلمة المرور
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* المودل */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl" dir="rtl">
//             <h3 className="font-black mb-4">تغيير كلمة المرور</h3>
//             <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" className="w-full p-3 border rounded-xl mb-4" />
//             {modalMessage && <p className="text-sm font-bold mb-4 text-red-600">{modalMessage}</p>}
//             <div className="flex gap-2">
//               <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded-xl">إغلاق</button>
//               <button onClick={handleUpdatePassword} disabled={isUpdating} className="flex-1 bg-[#D4AF37] py-2 rounded-xl font-bold">
//                 {isUpdating ? <span className="spinner"></span> : "تحديث"}
//               </button>
//             </div>
//             <p className="text-[10px] text-center text-gray-400 mt-4">حقوق نظام تحديث كلمة المرور محفوظة لشركة الدولار توب © 2026</p>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }


