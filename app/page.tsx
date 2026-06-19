"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const usersList = [
    { username: "dollar1", password: "111", name: "الزبون الأول" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const foundUser = usersList.find(
      (user) => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password
    );

    if (foundUser) {
      router.push("/dashbord"); 
    } else {
      setErrorMessage("عذراً، اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
      {/* 1. التنسيقات */}
      <style dangerouslySetInnerHTML={{ __html: `
        input {
          -webkit-appearance: none;
          appearance: none;
          color: #000 !important;
        }
        @keyframes slideMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .dollar-marquee-track {
          animation: slideMarquee 22s linear infinite;
        }
      `}} />

      {/* 2. الشريط المتحرك (تمت استعادة التكرار لضمان الاستمرارية) */}
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

      {/* 3. المحتوى الرئيسي (لم يتغير أي شيء هنا) */}
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
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900 placeholder-gray-400"
                dir="rtl"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900 placeholder-gray-400"
                dir="ltr"
                required
              />
              {errorMessage && (
                <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const usersList = [
//     { username: "dollar1", password: "111", name: "الزبون الأول" },
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");

//     const foundUser = usersList.find(
//       (user) => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password
//     );

//     if (foundUser) {
//       router.push("/dashbord"); 
//     } else {
//       setErrorMessage("عذراً، اسم المستخدم أو كلمة المرور غير صحيحة!");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
//       {/* 1. التنسيقات الإضافية لضمان ظهور النص بوضوح على الموبايل */}
//       <style dangerouslySetInnerHTML={{ __html: `
//         input {
//           -webkit-appearance: none;
//           appearance: none;
//           color: #000 !important;
//         }
//         @keyframes slideMarquee {
//           0% { transform: translateX(0%); }
//           100% { transform: translateX(-100%); }
//         }
//         .dollar-marquee-track {
//           animation: slideMarquee 22s linear infinite;
//         }
//       `}} />

//       {/* 2. الشريط المتحرك */}
//       <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
//       </div>

//       {/* 3. المحتوى الرئيسي */}
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
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="اسم المستخدم"
//                 className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900 placeholder-gray-400"
//                 dir="rtl"
//                 required
//               />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="كلمة المرور"
//                 className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white text-gray-900 placeholder-gray-400"
//                 dir="ltr"
//                 required
//               />
//               {errorMessage && (
//                 <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
//                   {errorMessage}
//                 </p>
//               )}
//               <button
//                 type="submit"
//                 className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2"
//               >
//                 تسجيل الدخول
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const usersList = [
//     { username: "dollar1", password: "111", name: "الزبون الأول" },
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");

//     const foundUser = usersList.find(
//       (user) => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password
//     );

//     if (foundUser) {
//       router.push("/dashbord"); 
//     } else {
//       setErrorMessage("عذراً، اسم المستخدم أو كلمة المرور غير صحيحة!");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
//       {/* 2. الشريط المتحرك التلقائي المستمر */}
//       <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track" aria-hidden="true">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>

//         <style dangerouslySetInnerHTML={{ __html: `
//           @keyframes slideMarquee {
//             0% { transform: translateX(0%); }
//             100% { transform: translateX(-100%); }
//           }
//           .dollar-marquee-track {
//             animation: slideMarquee 22s linear infinite;
//           }
//         `}} />
//       </div>

//       {/* 3. محتوى الصفحة الرئيسي */}
//       <div className="flex-1 flex items-center justify-center p-4 md:p-8">
//         <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:px-16">
          
//           {/* الجانب الأيمن: الترحيب وقسم لوجو الشركة والباركود */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-right space-y-8">
//             <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight max-w-xl">
//               مرحبا بكم في شركة <span className="text-[#D4AF37]">الدولار توب</span> للصرافة والدفع الالكتروني
//             </h1>

//             {/* صندوق لوجو الشركة والباركود */}
//             <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4 transition-all hover:shadow-lg">
              
//               <div className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-inner relative group overflow-hidden">
//                 <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
//                   <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>
              
//               <div className="text-center">
//                 <h3 className="font-black text-gray-800 text-lg">شركة الدولار توب</h3>
//                 <p className="text-xs font-bold text-[#C29D2F] mt-0.5">ثقة • سرعة • أمان</p>
//               </div>

//               {/* إضافة الباركود هنا */}
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

//           {/* الجانب الأيسر: كارت تسجيل الدخول */}
//           <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 flex flex-col">
//             <div className="text-center mb-8 border-b border-gray-100 pb-5">
//               <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-3 border border-[#D4AF37]/20 shadow-sm">
//                 <span className="text-3xl">🔑</span>
//               </div>
//               <h2 className="text-2xl font-black text-gray-900 tracking-tight">تسجيل الدخول</h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="اسم المستخدم"
//                 className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-gray-50/30"
//                 dir="ltr"
//                 required
//               />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="كلمة المرور"
//                 className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-gray-50/30"
//                 dir="ltr"
//                 required
//               />
//               {errorMessage && (
//                 <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
//                   {errorMessage}
//                 </p>
//               )}
//               <button
//                 type="submit"
//                 className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2"
//               >
//                 تسجيل الدخول
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const usersList = [
//     { username: "dollar1", password: "111", name: "الزبون الأول" },

//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");

//     const foundUser = usersList.find(
//       (user) => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password
//     );

//     if (foundUser) {
//       router.push("/dashbord"); // تأكد من تهجئة اسم المجلد في مشروعك (dashbord أو dashboard)
//     } else {
//       setErrorMessage("عذراً، اسم المستخدم أو كلمة المرور غير صحيحة!");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
//       {/* 1. الشريط العلوي (Navbar) */}
     

//       {/* 2. الشريط المتحرك التلقائي المستمر */}
//       <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track" aria-hidden="true">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>

//         <style dangerouslySetInnerHTML={{ __html: `
//           @keyframes slideMarquee {
//             0% { transform: translateX(0%); }
//             100% { transform: translateX(-100%); }
//           }
//           .dollar-marquee-track {
//             animation: slideMarquee 22s linear infinite;
//           }
//         `}} />
//       </div>

//       {/* 3. محتوى الصفحة الرئيسي */}
//       <div className="flex-1 flex items-center justify-center p-4 md:p-8">
//         <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:px-16">
          
//           {/* الجانب الأيمن: الترحيب وقسم لوجو الشركة بدلاً من الباركود */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-right space-y-8">
//             <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight max-w-xl">
//               مرحبا بكم في شركة <span className="text-[#D4AF37]">الدولار توب</span> للصرافة والدفع الالكتروني
//             </h1>

//             {/* صندوق لوجو الشركة الجديد */}
//             <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4 transition-all hover:shadow-lg">
              
//               {/* مجسم اللوجو الرئيسي (بإمكانك استبدال مسار الصورة بـ شعارك الحقيقي لاحقاً) */}
//               <div className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-inner relative group overflow-hidden">
//                 <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
//                   <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
//                 </span>
                
//                 {/* تأثير إضاءة جمالي خلف اللوجو */}
//                 <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>
              
//               <div className="text-center">
//                 <h3 className="font-black text-gray-800 text-lg">شركة الدولار توب</h3>
//                 <p className="text-xs text-[#text-[#C29D2F]] font-bold text-[#C29D2F] mt-0.5">ثقة • سرعة • أمان</p>
//               </div>
//             </div>
//           </div>

//           {/* الجانب الأيسر: كارت تسجيل الدخول */}
//           <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 flex flex-col">
            
//             {/* الهيدر الداخلي للكارت */}
//             <div className="text-center mb-8 border-b border-gray-100 pb-5">
//               <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-3 border border-[#D4AF37]/20 shadow-sm">
//                 <span className="text-3xl">🔑</span>
//               </div>
//               <h2 className="text-2xl font-black text-gray-900 tracking-tight">تسجيل الدخول</h2>
            
//             </div>

//             {/* نموذج تسجيل الدخول */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>

//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="اسم المستخدم"
//                   className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-gray-50/30"
//                   dir="ltr"
//                   required
//                 />
//               </div>

//               <div>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="كلمة المرور"
//                   className="w-full p-4 border border-gray-300 rounded-xl text-lg text-right focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-gray-50/30"
//                   dir="ltr"
//                   required
//                 />
//               </div>

//               {errorMessage && (
//                 <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-xl border border-red-200">
//                   {errorMessage}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-md mt-2"
//               >
//                 تسجيل الدخول
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // تم تصحيح الـ import هنا لحل الخطأ الأحمر

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const usersList = [
//     { username: "dollar1", password: "111", name: "الزبون الأول" },
//     { username: "ahmed", password: "222", name: "أحمد العالي" },
//     { username: "khaled", password: "333", name: "شركة النور" },
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");

//     const foundUser = usersList.find(
//       (user) => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password
//     );

//     if (foundUser) {
//       router.push("/dashbord");
//     } else {
//       setErrorMessage("عذراً، اسم المستخدم أو كلمة المرور غير صحيحة!");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" dir="rtl">
      
//       <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-16 flex justify-between items-center z-50 shadow-sm">
//         <div className="text-2xl font-black text-[#D4AF37] tracking-tight">
//           الدولار توب
//         </div>
//         <div className="flex gap-6 text-sm font-bold text-gray-500">
//           <a href="#" className="hover:text-[#D4AF37] transition-colors">الرئيسية</a>
//           <a href="#" className="hover:text-[#D4AF37] transition-colors">اتصل بنا</a>
//           <a href="#" className="hover:text-[#D4AF37] transition-colors">الدعم الفني</a>
//         </div>
//       </nav>

//       {/* 2. الشريط المتحرك التلقائي المستمر (تمت إضافته هنا) */}
//       <div className="w-full bg-[#1a1a1a] text-[#ad8c20] border-b border-[#D4AF37]/20 py-4 overflow-hidden shadow-sm z-40 relative flex" dir="ltr">
        
//         {/* المجموعة الأولى للتحرك */}
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track">
// <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>
        
//         {/* المجموعة الثانية التي تلاحق الأولى فوراً لسد الفراغ ومنع التوقف */}
//         <div className="flex whitespace-nowrap min-w-full shrink-0 justify-around gap-12 dollar-marquee-track" aria-hidden="true">
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//           <span className="font-black text-lg md:text-2xl px-4" dir="rtl">⚡ متاح سحب usdt  •  أسعار العملات  •  متاح الإرسال والاستقبال لكل الدول  •  بأعلى سرعة ⚡</span>
//         </div>

//         {/* حقن الـ CSS بالطريقة الآمنة المتوافقة مع Next.js */}
//         <style dangerouslySetInnerHTML={{ __html: `
//           @keyframes slideMarquee {
//             0% { transform: translateX(0%); }
//             100% { transform: translateX(-100%); }
//           }
//           .dollar-marquee-track {
//             animation: slideMarquee 22s linear infinite;
//           }
//         `}} />
//       </div>

//       {/* 3. محتوى صفحة تسجيل الدخول */}
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:gap-0 lg:px-16">
//           <div className="text-center lg:text-right lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-16">
//             <div className="text-5xl font-black text-[#D4AF37] mb-6 tracking-tight drop-shadow-sm">
//               الدولار توب
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 leading-tight max-w-xl">
//               مرحبا بكم في شركة الدولار توب للصرافة والدفع الالكتروني
//             </h1>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="اسم المستخدم"
//                 className="w-full p-4 border border-gray-300 rounded-lg text-lg text-right"
//                 dir="ltr"
//                 required
//               />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="كلمة المرور"
//                 className="w-full p-4 border border-gray-300 rounded-lg text-lg text-right"
//                 dir="ltr"
//                 required
//               />
//               {errorMessage && (
//                 <p className="text-red-600 text-sm font-bold text-right bg-red-50 p-3 rounded-lg border border-red-200">
//                   {errorMessage}
//                 </p>
//               )}
//               <button
//                 type="submit"
//                 className="w-full bg-[#D4AF37] hover:bg-[#C29D2F] text-black p-3.5 rounded-lg text-2xl font-black transition-colors shadow-md"
//               >
//                 تسجيل الدخول
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

