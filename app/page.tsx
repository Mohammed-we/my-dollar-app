"use client";

// @ts-ignore
import Papa from "papaparse";
import { useState, useEffect } from "react";
import Head from 'next/head';

export default function UserInterface() {
  const [country, setCountry] = useState("اختر الدولة");
  const [showAccount, setShowAccount] = useState(false);
  const [accounts, setAccounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenCountry, setIsOpenCountry] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // تم تحديث الرقم هنا
  const phone = "32468133331"; 

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: any = {};
        results.data.forEach((row: any) => {
          const keys = Object.keys(row);
          const countryName = row[keys[0]]?.trim();
          const details = row[keys[1]];
          if (countryName) data[countryName] = details;
        });
        setAccounts(data);
        setIsLoading(false);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  }, []);

  const handleWhatsApp = (msg?: string) => {
    const message = msg || `مرحباً، أريد طلب حساب.\nالدولة: ${country}\nبيانات الحساب:\n${accounts[country]}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  const filteredCountries = Object.keys(accounts).filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      <Head>
        <title>طلب حساب</title>
      </Head>

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/money.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div onClick={() => handleWhatsApp("مرحباً، أستفسر عن خدماتكم.")} className="fixed bottom-6 left-6 z-50 cursor-pointer animate-pulse">
        <div className="bg-green-500 p-3 rounded-full shadow-lg text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.955c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.007 0C5.37 0 .002 5.367.002 12.004c0 2.092.547 4.136 1.588 5.933L.057 23.95l4.13-1.084a11.84 11.84 0 0 0 5.658 1.44H11.99c6.637 0 12.005-5.367 12.005-12.005 0-3.21-1.25-6.233-3.522-8.506" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4 border border-[#D4AF37]/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-black text-white drop-shadow-md">طلب حساب</h1>
        </div>

        {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
            
            <div className="w-full relative">
              <div 
                className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold text-lg cursor-pointer flex justify-between items-center shadow-lg" 
                onClick={() => setIsOpenCountry(!isOpenCountry)}
              >
                <span>{country}</span>
                <span className="text-[#D4AF37]">▼</span>
              </div>
              
              {isOpenCountry && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2 z-50 border border-gray-200">
                  <div className="relative mb-2 sticky top-0 bg-white">
                    <input autoFocus placeholder="ابحث..." className="w-full p-3 border-b outline-none text-black font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  {filteredCountries.map(c => (
                    <div key={c} className="p-4 hover:bg-[#D4AF37]/10 border-b text-right cursor-pointer text-black font-semibold" onClick={() => { setCountry(c); setIsOpenCountry(false); }}>{c}</div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl active:scale-95 transition-transform shadow-lg">طلب الحساب</button>
          </form>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            <div className="bg-black/30 border border-[#D4AF37] p-3 rounded-xl text-white font-bold text-right w-full max-w-[90vw]">
              <p className="mb-1 text-[#D4AF37] text-sm">بيانات {country}:</p>
              <div className="text-sm text-white whitespace-pre-line leading-relaxed">
                {String(accounts[country] || "").split('\n').filter(l => l.trim() !== "").join('\n')}
              </div>
            </div>
            
            <div className="w-full space-y-3">
                <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform">نسخ البيانات</button>
                <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">اطلب عبر واتساب</button>
                <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


// "use client";

// // @ts-ignore
// import Papa from "papaparse";
// import { useState, useEffect } from "react";
// import Head from 'next/head';

// export default function UserInterface() {
//   const [country, setCountry] = useState("اختر الدولة");
//   const [showAccount, setShowAccount] = useState(false);
//   const [accounts, setAccounts] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [isOpenCountry, setIsOpenCountry] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const phone = "324681333331"; 

//   const sheetUrl =
//     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

//   useEffect(() => {
//     Papa.parse(sheetUrl, {
//       download: true,
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const data: any = {};
//         results.data.forEach((row: any) => {
//           const keys = Object.keys(row);
//           const countryName = row[keys[0]]?.trim();
//           const details = row[keys[1]];
//           if (countryName) data[countryName] = details;
//         });
//         setAccounts(data);
//         setIsLoading(false);
//       },
//       error: () => {
//         setIsLoading(false);
//       },
//     });
//   }, []);

//   const handleWhatsApp = () => {
//     const message = `مرحباً، أريد طلب حساب.\nالدولة: ${country}\nبيانات الحساب:\n${accounts[country]}`;
//     window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     alert("تم النسخ!");
//   };

//   const filteredCountries = Object.keys(accounts).filter(c => 
//     c.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
//       <Head>
//         <title>طلب حساب</title>
//       </Head>

//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
//         <source src="/money.mp4" type="video/mp4" />
//       </video>
//       {/* تعديل هنا: تم تغيير bg-black/60 لضمان تباين أعلى للنص */}
//       <div className="absolute inset-0 bg-black/70 z-0"></div>

//       <div onClick={() => window.open(`https://wa.me/${phone}`, "_blank")} className="fixed bottom-6 left-6 z-50 cursor-pointer animate-pulse">
//         <div className="bg-green-500 p-3 rounded-full shadow-lg text-white flex items-center justify-center">
//           <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.955c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.007 0C5.37 0 .002 5.367.002 12.004c0 2.092.547 4.136 1.588 5.933L.057 23.95l4.13-1.084a11.84 11.84 0 0 0 5.658 1.44H11.99c6.637 0 12.005-5.367 12.005-12.005 0-3.21-1.25-6.233-3.522-8.506" />
//           </svg>
//         </div>
//       </div>

//       {/* تعديل هنا: bg-black/40 لتباين أقوى، وإضافة drop-shadow للنصوص */}
//       <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
//         <div className="mb-6">
//           <div className="w-20 h-20 mx-auto bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4 border border-[#D4AF37]/30">
//             <span className="text-4xl">💰</span>
//           </div>
//           <h1 className="text-2xl font-black text-white drop-shadow-md">طلب حساب</h1>
//         </div>

//         {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
//           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة") setShowAccount(true); }}>
//             <div className="w-full bg-black/30 p-4 rounded-2xl text-white cursor-pointer font-bold border border-white/20" onClick={() => setIsOpenCountry(!isOpenCountry)}>{country}</div>
//             {isOpenCountry && (
//               <div className="bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
//                 <div className="relative mb-2">
//                     <input autoFocus placeholder="ابحث..." className="w-full p-2 border-b outline-none text-black pr-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                 </div>
//                 {filteredCountries.map(c => <div key={c} className="p-3 hover:bg-gray-100 border-b text-right cursor-pointer text-black" onClick={() => { setCountry(c); setIsOpenCountry(false); }}>{c}</div>)}
//               </div>
//             )}
//             <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl active:scale-95 transition-transform shadow-lg">طلب الحساب</button>
//           </form>
//         ) : (
//           <div className="space-y-4 flex flex-col items-center">
//             <div className="bg-black/30 border border-[#D4AF37] p-3 rounded-xl text-white font-bold text-right w-full max-w-[90vw]">
//               <p className="mb-1 text-[#D4AF37] text-sm">بيانات {country}:</p>
//               <div className="text-sm text-white whitespace-pre-line leading-relaxed">
//                 {String(accounts[country] || "").split('\n').filter(l => l.trim() !== "").join('\n')}
//               </div>
//             </div>
            
//             <div className="w-full space-y-3">
//                 <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform">نسخ البيانات</button>
//                 <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">اطلب عبر واتساب</button>
//                 <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


