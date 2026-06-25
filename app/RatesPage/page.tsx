

"use client";

import Papa from "papaparse";
import { useState, useEffect } from "react";
import Head from 'next/head';
import Navbar from "@/componant/Navbar";
import { supabase } from '@/lib/supabase';

export default function UserInterface() {
  const [country, setCountry] = useState("اختر الدولة");
  const [transferMethod, setTransferMethod] = useState("طريقة التحويل (اختياري)");
  const [showAccount, setShowAccount] = useState(false);
  const [accounts, setAccounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<"country" | "method" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const phone = "32468133331";  
  const methods = ["ويسترن يونيون", "موني جرام", "ريا", "حساب بنكي أو محفظة"];
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch("/api/currencies");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCurrencies(data);
        }
      } catch {
        // ignore fetch errors
      }
    }

    fetchCurrencies();
    const interval = setInterval(fetchCurrencies, 15000);

    const channel = supabase
      .channel('currency-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'currencies'
      }, (payload) => {
        setCurrencies(prev => prev.map(curr =>
          curr.id === payload.new.id ? { ...curr, ...payload.new } : curr
        ));
      })
      .subscribe();

    Papa.parse(sheetUrl, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const data: any = {};
        results.data.forEach((row: any) => {
          const keys = Object.keys(row);
          const countryName = row[keys[0]]?.trim();
          const details = row[keys[1]];
          if (countryName) data[countryName] = details;
        });
        setAccounts(data); setIsLoading(false);
      },
      error: () => setIsLoading(false),
    });

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const isMethodAvailable = () => {
    if (transferMethod === "طريقة التحويل (اختياري)") return true;
    const accountDetails = accounts[country]?.toLowerCase() || "";
    
    if (transferMethod === "حساب بنكي أو محفظة") {
      return accountDetails.includes("بنك") || 
             accountDetails.includes("محفظة") || 
             accountDetails.includes("حساب");
    }
    
    return accountDetails.includes(transferMethod.toLowerCase());
  };

  const handleWhatsApp = () => {
    const methodText = transferMethod !== "طريقة التحويل (اختياري)" ? `طريقة التحويل: ${transferMethod}` : "لم يتم تحديد طريقة";
    const message = `مرحباً، أريد طلب حساب.\nالدولة: ${country}\n${methodText}\nبيانات الحساب:\n${accounts[country]}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  const filteredCountries = Object.keys(accounts).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <Navbar/>
      <Head><title>طلب حساب</title></Head>

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/money.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
        <h1 className="text-2xl font-black text-white mb-6">طلب حساب</h1>

        {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
            <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => { setSearchQuery(""); setShowModal("country"); }}>
              <span>{country}</span>
              <span className="text-[#D4AF37]">▼</span>
            </div>
            
            <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setShowModal("method")}>
              <span>{transferMethod}</span>
              <span className="text-[#D4AF37]">▼</span>
            </div>
            
            <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg">طلب الحساب</button>
          </form>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            {isMethodAvailable() ? (
              <div className="bg-black/30 border border-[#D4AF37] p-4 rounded-xl text-white font-bold text-right w-fit min-w-[280px]">
                <p className="text-[#D4AF37] text-sm mb-2">بيانات {country}:</p>
                <div className="text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{accounts[country]}</div>
              </div>
            ) : (
              <p className="text-red-500 font-bold p-4 bg-black/50 rounded-xl">عذراً، {transferMethod} غير متوفر حالياً لهذه الدولة.</p>
            )}
            
            <div className="w-full bg-white/10 p-3 rounded-xl text-xs text-white text-right">
              <p className="text-[#D4AF37] font-bold mb-1">تعليمات هامة:</p>
              <p>• تأكد من صحة البيانات قبل التحويل.</p>
              <p>• احتفظ بصورة الإيصال بعد إتمام العملية.</p>
            </div>

            <div className="w-full space-y-3">
              {isMethodAvailable() && <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">نسخ البيانات</button>}
              <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">اطلب عبر واتساب</button>
              <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-[#D4AF37] rounded-3xl p-6 w-full max-w-xs h-[60vh] flex flex-col">
            <h2 className="text-white font-black mb-4">{showModal === "country" ? "اختر الدولة" : "طريقة التحويل"}</h2>
            
            {showModal === "country" && (
              <input placeholder="ابحث..." className="w-full p-3 mb-4 bg-black/50 border border-[#D4AF37] text-white rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            )}
            
            <div className="flex-1 overflow-y-auto">
              {(showModal === "country" ? filteredCountries : methods).map(item => (
                <div key={item} className="p-4 border-b border-white/10 text-white font-bold cursor-pointer hover:bg-[#D4AF37] transition-all rounded-lg" onClick={() => {
                  showModal === "country" ? setCountry(item) : setTransferMethod(item);
                  setShowModal(null);
                }}>{item}</div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-3 bg-[#D4AF37] text-black font-bold rounded-xl" onClick={() => setShowModal(null)}>إغلاق</button>
          </div>
        </div>
      )}

      <div className="relative z-10  mt-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
        <h2 className="text-xl font-black text-[#D4AF37] mb-4">أسعار العملات</h2>
        <table className="w-full text-white text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-2">العملة</th>
              <th className="p-2">شراء</th>
              <th className="p-2">بيع</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((curr: any) => (
              <tr key={curr.id} className="border-b border-white/10">
                <td className="p-2 font-bold">{curr.name}</td>
                <td className="p-2">{curr.buy_price}</td>
                <td className="p-2">{curr.sell_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


// "use client";

// import Papa from "papaparse";
// import { useState, useEffect } from "react";
// import Head from 'next/head';
// import Navbar from "@/componant/Navbar";
// import { supabase } from '@/lib/supabase';

// export default function UserInterface() {
//   const [country, setCountry] = useState("اختر الدولة");
//   const [transferMethod, setTransferMethod] = useState("طريقة التحويل (اختياري)");
//   const [showAccount, setShowAccount] = useState(false);
//   const [accounts, setAccounts] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [currencies, setCurrencies] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState<"country" | "method" | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const phone = "32468133331";  
//   const methods = ["ويسترن يونيون", "موني جرام", "ريا", "حساب بنكي أو محفظة"];
//   const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

//   useEffect(() => {
//     async function fetchCurrencies() {
//       try {
//         const res = await fetch("/api/currencies");
//         const data = await res.json();
//         if (res.ok && Array.isArray(data)) setCurrencies(data);
//       } catch {}
//     }
//     fetchCurrencies();
//     const interval = setInterval(fetchCurrencies, 15000);

//     const channel = supabase.channel('currency-updates').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'currencies' }, (payload) => {
//         setCurrencies(prev => prev.map(curr => curr.id === payload.new.id ? { ...curr, ...payload.new } : curr));
//     }).subscribe();

//     Papa.parse(sheetUrl, {
//       download: true, header: true, skipEmptyLines: true,
//       complete: (results) => {
//         const data: any = {};
//         results.data.forEach((row: any) => {
//           const keys = Object.keys(row);
//           if (row[keys[0]]) data[row[keys[0]]?.trim()] = row[keys[1]];
//         });
//         setAccounts(data); setIsLoading(false);
//       }
//     });
//     return () => { clearInterval(interval); supabase.removeChannel(channel); };
//   }, []);

//   const isMethodAvailable = () => {
//     if (transferMethod === "طريقة التحويل (اختياري)") return true;
//     const accountDetails = accounts[country]?.toLowerCase() || "";
//     if (transferMethod === "حساب بنكي أو محفظة") return accountDetails.includes("بنك") || accountDetails.includes("محفظة") || accountDetails.includes("حساب");
//     return accountDetails.includes(transferMethod.toLowerCase());
//   };

//   const handleWhatsApp = () => {
//     const methodText = transferMethod !== "طريقة التحويل (اختياري)" ? `طريقة التحويل: ${transferMethod}` : "لم يتم تحديد طريقة";
//     const message = `مرحباً، أريد طلب حساب.\nالدولة: ${country}\n${methodText}\nبيانات الحساب:\n${accounts[country]}`;
//     window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     alert("تم النسخ!");
//   };

//   const filteredCountries = Object.keys(accounts).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

//   return (
//     <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
//       <Navbar/>
//       <Head><title>طلب حساب</title></Head>

//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover"><source src="/money.mp4" type="video/mp4" /></video>
//       <div className="absolute inset-0 bg-black/70 z-0"></div>

//       <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h1 className="text-2xl font-black text-white mb-6">طلب حساب</h1>

//         {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
//           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
            
//             <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setShowModal("country")}>
//               <span>{country}</span> <span className="text-[#D4AF37]">▼</span>
//             </div>
            
//             <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setShowModal("method")}>
//               <span>{transferMethod}</span> <span className="text-[#D4AF37]">▼</span>
//             </div>

//             <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg">طلب الحساب</button>
//           </form>
//         ) : (
//           <div className="space-y-4 flex flex-col items-center">
//             {isMethodAvailable() ? (
//               <div className="bg-black/30 border border-[#D4AF37] p-4 rounded-xl text-white font-bold text-right w-fit min-w-[280px]">
//                 <p className="text-[#D4AF37] text-sm mb-2">بيانات {country}:</p>
//                 <div className="text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{accounts[country]}</div>
//               </div>
//             ) : (<p className="text-red-500 font-bold p-4 bg-black/50 rounded-xl">عذراً، {transferMethod} غير متوفر حالياً لهذه الدولة.</p>)}
            
//             <div className="w-full bg-white/10 p-3 rounded-xl text-xs text-white text-right">
//               <p className="text-[#D4AF37] font-bold mb-1">تعليمات هامة:</p>
//               <p>• تأكد من صحة البيانات قبل التحويل.</p>
//               <p>• احتفظ بصورة الإيصال بعد إتمام العملية.</p>
//             </div>

//             <div className="w-full space-y-3">
//               {isMethodAvailable() && <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">نسخ البيانات</button>}
//               <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">اطلب عبر واتساب</button>
//               <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
//             </div>
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
//           <div className="bg-black border border-[#D4AF37] rounded-3xl p-6 w-full max-w-xs max-h-[80vh] overflow-y-auto">
//             <h2 className="text-white font-black mb-4">{showModal === "country" ? "اختر الدولة" : "طريقة التحويل"}</h2>
//             {showModal === "country" && <input placeholder="ابحث..." className="w-full p-2 mb-4 bg-black/50 border border-[#D4AF37] text-white rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />}
            
//             {(showModal === "country" ? filteredCountries : methods).map(item => (
//               <div key={item} className="p-4 border-b border-white/10 text-white font-bold cursor-pointer hover:bg-[#D4AF37]" onClick={() => {
//                 showModal === "country" ? setCountry(item) : setTransferMethod(item);
//                 setShowModal(null);
//               }}>{item}</div>
//             ))}
//             <button className="w-full mt-4 py-2 text-[#D4AF37] font-bold" onClick={() => setShowModal(null)}>إغلاق</button>
//           </div>
//         </div>
//       )}

//       <div className="relative z-10 mt-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h2 className="text-xl font-black text-[#D4AF37] mb-4">أسعار العملات</h2>
//         <table className="w-full text-white text-sm border-collapse">
//           <thead>
//             <tr className="border-b border-white/20"><th className="p-2">العملة</th><th className="p-2">شراء</th><th className="p-2">بيع</th></tr>
//           </thead>
//           <tbody>
//             {currencies.map((curr: any) => (
//               <tr key={curr.id} className="border-b border-white/10"><td className="p-2 font-bold">{curr.name}</td><td className="p-2">{curr.buy_price}</td><td className="p-2">{curr.sell_price}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }


// "use client";

// import Papa from "papaparse";
// import { useState, useEffect } from "react";
// import Head from 'next/head';
// import Navbar from "@/componant/Navbar";
// import { supabase } from '@/lib/supabase';

// export default function UserInterface() {
//   const [country, setCountry] = useState("اختر الدولة");
//   const [transferMethod, setTransferMethod] = useState("طريقة التحويل (اختياري)");
//   const [showAccount, setShowAccount] = useState(false);
//   const [accounts, setAccounts] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [currencies, setCurrencies] = useState<any[]>([]);
//   const [isOpenCountry, setIsOpenCountry] = useState(false);
//   const [isOpenMethod, setIsOpenMethod] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const phone = "32468133331";  
//   const methods = ["ويسترن يونيون", "موني جرام", "ريا","حساب بنكي أو محفظة"];
//   const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

//   useEffect(() => {
//     async function fetchCurrencies() {
//       try {
//         const res = await fetch("/api/currencies");
//         const data = await res.json();
//         if (res.ok && Array.isArray(data)) {
//           setCurrencies(data);
//         }
//       } catch {
//         // ignore fetch errors
//       }
//     }

//     fetchCurrencies();
//     const interval = setInterval(fetchCurrencies, 15000);

//     const channel = supabase
//       .channel('currency-updates')
//       .on('postgres_changes', {
//         event: 'UPDATE',
//         schema: 'public',
//         table: 'currencies'
//       }, (payload) => {
//         setCurrencies(prev => prev.map(curr =>
//           curr.id === payload.new.id ? { ...curr, ...payload.new } : curr
//         ));
//       })
//       .subscribe();

//     Papa.parse(sheetUrl, {
//       download: true, header: true, skipEmptyLines: true,
//       complete: (results) => {
//         const data: any = {};
//         results.data.forEach((row: any) => {
//           const keys = Object.keys(row);
//           const countryName = row[keys[0]]?.trim();
//           const details = row[keys[1]];
//           if (countryName) data[countryName] = details;
//         });
//         setAccounts(data); setIsLoading(false);
//       },
//       error: () => setIsLoading(false),
//     });

//     return () => {
//       clearInterval(interval);
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   // تم تحديث هذه الدالة للبحث الذكي
//   const isMethodAvailable = () => {
//     if (transferMethod === "طريقة التحويل (اختياري)") return true;
//     const accountDetails = accounts[country]?.toLowerCase() || "";
    
//     if (transferMethod === "حساب بنكي أو محفظة") {
//       return accountDetails.includes("بنك") || 
//              accountDetails.includes("محفظة") || 
//              accountDetails.includes("حساب");
//     }
    
//     return accountDetails.includes(transferMethod.toLowerCase());
//   };

//   const handleWhatsApp = () => {
//     const methodText = transferMethod !== "طريقة التحويل (اختياري)" ? `طريقة التحويل: ${transferMethod}` : "لم يتم تحديد طريقة";
//     const message = `مرحباً، أريد طلب حساب.\nالدولة: ${country}\n${methodText}\nبيانات الحساب:\n${accounts[country]}`;
//     window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     alert("تم النسخ!");
//   };

//   const filteredCountries = Object.keys(accounts).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

//   return (
//     <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
//       <Navbar/>
//       <Head><title>طلب حساب</title></Head>

//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
//         <source src="/money.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 bg-black/70 z-0"></div>

//       <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h1 className="text-2xl font-black text-white mb-6">طلب حساب</h1>

//         {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
//           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
//             <div className="w-full relative">
//               <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenCountry(!isOpenCountry)}>
//                 <span>{country}</span>
//                 <span className="text-[#D4AF37]">▼</span>
//                </div>
//               {isOpenCountry && (
//                 <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
//                   <input placeholder="ابحث..." className="w-full p-2 bg-transparent border-b border-[#D4AF37] text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                   {filteredCountries.map(c => (
//                     <div key={c} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setCountry(c); setIsOpenCountry(false); }}>{c}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="w-full relative">
//               <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenMethod(!isOpenMethod)}>
//                 <span>{transferMethod}</span>
//                 <span className="text-[#D4AF37]">▼</span>
//               </div>
//               {isOpenMethod && (
//                 <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
//                   {methods.map(m => (
//                     <div key={m} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setTransferMethod(m); setIsOpenMethod(false); }}>{m}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg">طلب الحساب</button>
//           </form>
//         ) : (
//           <div className="space-y-4 flex flex-col items-center">
//             {isMethodAvailable() ? (
//               <div className="bg-black/30 border border-[#D4AF37] p-4 rounded-xl text-white font-bold text-right w-fit min-w-[280px]">
//                 <p className="text-[#D4AF37] text-sm mb-2">بيانات {country}:</p>
//                 <div className="text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{accounts[country]}</div>
//               </div>
//             ) : (
//               <p className="text-red-500 font-bold p-4 bg-black/50 rounded-xl">عذراً، {transferMethod} غير متوفر حالياً لهذه الدولة.</p>
//             )}
            
//             <div className="w-full bg-white/10 p-3 rounded-xl text-xs text-white text-right">
//               <p className="text-[#D4AF37] font-bold mb-1">تعليمات هامة:</p>
//               <p>• تأكد من صحة البيانات قبل التحويل.</p>
//               <p>• احتفظ بصورة الإيصال بعد إتمام العملية.</p>
//             </div>

//             <div className="w-full space-y-3">
//               {isMethodAvailable() && <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">نسخ البيانات</button>}
//               <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">اطلب عبر واتساب</button>
//               <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="relative z-10  mt-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h2 className="text-xl font-black text-[#D4AF37] mb-4">أسعار العملات</h2>
//         <table className="w-full text-white text-sm border-collapse">
//           <thead>
//             <tr className="border-b border-white/20">
//               <th className="p-2">العملة</th>
//               <th className="p-2">شراء</th>
//               <th className="p-2">بيع</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currencies.map((curr: any) => (
//               <tr key={curr.id} className="border-b border-white/10">
//                 <td className="p-2 font-bold">{curr.name}</td>
//                 <td className="p-2">{curr.buy_price}</td>
//                 <td className="p-2">{curr.sell_price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// "use client";

// import Papa from "papaparse";
// import { useState, useEffect } from "react";
// import Head from 'next/head';
// import Navbar from "@/componant/Navbar";
// import { supabase } from '@/lib/supabase';

// export default function UserInterface() {
//   const [country, setCountry] = useState("اختر الدولة");
//   const [transferMethod, setTransferMethod] = useState("طريقة التحويل (اختياري)");
//   const [showAccount, setShowAccount] = useState(false);
//   const [accounts, setAccounts] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [currencies, setCurrencies] = useState<any[]>([]);
//   const [isOpenCountry, setIsOpenCountry] = useState(false);
//   const [isOpenMethod, setIsOpenMethod] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const phone = "32468133331";  
//   const methods = ["ويسترن يونيون", "موني جرام", "ريا","حساب بنكي أو محفظة"];
//   const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

//   useEffect(() => {
//     async function fetchCurrencies() {
//       try {
//         const res = await fetch("/api/currencies");
//         const data = await res.json();
//         if (res.ok && Array.isArray(data)) {
//           setCurrencies(data);
//         }
//       } catch {
//         // ignore fetch errors
//       }
//     }

//     fetchCurrencies();
//     const interval = setInterval(fetchCurrencies, 15000);

//     const channel = supabase
//       .channel('currency-updates')
//       .on('postgres_changes', {
//         event: 'UPDATE',
//         schema: 'public',
//         table: 'currencies'
//       }, (payload) => {
//         setCurrencies(prev => prev.map(curr =>
//           curr.id === payload.new.id ? { ...curr, ...payload.new } : curr
//         ));
//       })
//       .subscribe();

//     Papa.parse(sheetUrl, {
//       download: true, header: true, skipEmptyLines: true,
//       complete: (results) => {
//         const data: any = {};
//         results.data.forEach((row: any) => {
//           const keys = Object.keys(row);
//           const countryName = row[keys[0]]?.trim();
//           const details = row[keys[1]];
//           if (countryName) data[countryName] = details;
//         });
//         setAccounts(data); setIsLoading(false);
//       },
//       error: () => setIsLoading(false),
//     });

//     return () => {
//       clearInterval(interval);
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const isMethodAvailable = () => {
//     if (transferMethod === "طريقة التحويل (اختياري)") return true;
//     return accounts[country]?.toLowerCase().includes(transferMethod.toLowerCase());
//   };

//   const handleWhatsApp = () => {
//     const methodText = transferMethod !== "طريقة التحويل (اختياري)" ? `طريقة التحويل: ${transferMethod}` : "لم يتم تحديد طريقة";
//     const message = `مرحباً، أريد طلب حساب.\nالدولة: ${country}\n${methodText}\nبيانات الحساب:\n${accounts[country]}`;
//     window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     alert("تم النسخ!");
//   };

//   const filteredCountries = Object.keys(accounts).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

//   return (
//     <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
//       <Navbar/>
//       <Head><title>طلب حساب</title></Head>

//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
//         <source src="/money.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 bg-black/70 z-0"></div>

//       <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h1 className="text-2xl font-black text-white mb-6">طلب حساب</h1>

//         {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
//           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
//             <div className="w-full relative">
//               <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenCountry(!isOpenCountry)}>
//                 <span>{country}</span>
//                 <span className="text-[#D4AF37]">▼</span>
//                </div>
//               {isOpenCountry && (
//                 <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
//                   <input placeholder="ابحث..." className="w-full p-2 bg-transparent border-b border-[#D4AF37] text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                   {filteredCountries.map(c => (
//                     <div key={c} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setCountry(c); setIsOpenCountry(false); }}>{c}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="w-full relative">
//               <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenMethod(!isOpenMethod)}>
//                 <span>{transferMethod}</span>
//                 <span className="text-[#D4AF37]">▼</span>
//               </div>
//               {isOpenMethod && (
//                 <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
//                   {methods.map(m => (
//                     <div key={m} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setTransferMethod(m); setIsOpenMethod(false); }}>{m}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg">طلب الحساب</button>
//           </form>
//         ) : (
//           <div className="space-y-4 flex flex-col items-center">
//             {isMethodAvailable() ? (
//               <div className="bg-black/30 border border-[#D4AF37] p-4 rounded-xl text-white font-bold text-right w-fit min-w-[280px]">
//                 <p className="text-[#D4AF37] text-sm mb-2">بيانات {country}:</p>
//                 <div className="text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{accounts[country]}</div>
//               </div>
//             ) : (
//               <p className="text-red-500 font-bold p-4 bg-black/50 rounded-xl">عذراً، {transferMethod} غير متوفر حالياً لهذه الدولة.</p>
//             )}
            
//             <div className="w-full bg-white/10 p-3 rounded-xl text-xs text-white text-right">
//               <p className="text-[#D4AF37] font-bold mb-1">تعليمات هامة:</p>
//               <p>• تأكد من صحة البيانات قبل التحويل.</p>
//               <p>• احتفظ بصورة الإيصال بعد إتمام العملية.</p>
//             </div>

//             <div className="w-full space-y-3">
//               {isMethodAvailable() && <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">نسخ البيانات</button>}
//               <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">اطلب عبر واتساب</button>
//               <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
//             </div>
//           </div>
//         )}
//       </div>

// <div className="relative z-10  mt-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <h2 className="text-xl font-black text-[#D4AF37] mb-4">أسعار العملات</h2>
//         <table className="w-full text-white text-sm border-collapse">
//           <thead>
//             <tr className="border-b border-white/20">
//               <th className="p-2">العملة</th>
//               <th className="p-2">شراء</th>
//               <th className="p-2">بيع</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currencies.map((curr: any) => (
//               <tr key={curr.id} className="border-b border-white/10">
//                 <td className="p-2 font-bold">{curr.name}</td>
//                 <td className="p-2">{curr.buy_price}</td>
//                 <td className="p-2">{curr.sell_price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }


