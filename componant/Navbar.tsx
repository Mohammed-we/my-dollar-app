// export default function Navbar() {
//   return (
//     <nav className="fixed top-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between text-white">
      
//       {/* جهة اليمين: اللوجو الدائري واسم الشركة */}
//       <div className="flex items-center gap-4">
//         <div className="h-12 w-12 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden shadow-lg">
//           <img 
//             src="/logo.jpeg" 
//             alt="Logo" 
//             className="h-full w-full object-cover rounded-full" 
//           />
//         </div>
//         <span className="text-xl font-bold tracking-wide">شركة الدولار توب</span>
//       </div>

//       {/* جهة اليسار: زر الخروج */}
//       <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
//         <span className="text-lg font-bold">خروج</span>
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//         </svg>
//       </div>
//     </nav>
//   );
// }
"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // مسح أي بيانات متعلقة بالجلسة (اختياري حسب منطق مشروعك)
    sessionStorage.removeItem("admin_logged_in");
    // إعادة توجيه المستخدم لصفحة تسجيل الدخول
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
      
      {/* جهة اليمين: اللوجو الدائري واسم الشركة */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden shadow-lg">
          <img 
            src="/logo.jpeg" 
            alt="Logo" 
            className="h-full w-full object-cover rounded-full" 
          />
        </div>
        <span className="text-xl font-bold tracking-wide">شركة الدولار توب</span>
      </div>

      {/* جهة اليسار: زر الخروج المفعل */}
      <div 
        onClick={handleLogout}
        className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37] transition-colors"
      >
        <span className="text-lg font-bold">خروج</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>
    </nav>
  );
}