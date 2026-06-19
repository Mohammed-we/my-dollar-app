"use client";

// @ts-ignore
import Papa from "papaparse";
import { useState, useEffect } from "react";
import Head from 'next/head';
import Navbar from "@/componant/Navbar";

export default function UserInterface() {
  const [country, setCountry] = useState("اختر الدولة");
  const [transferMethod, setTransferMethod] = useState("اختر طريقة التحويل"); 
  const [showAccount, setShowAccount] = useState(false);
  const [accounts, setAccounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [isOpenCountry, setIsOpenCountry] = useState(false);
  const [isOpenMethod, setIsOpenMethod] = useState(false); // حالة جديدة للقائمة المنسدلة لطريقة التحويل
  
  const [searchQuery, setSearchQuery] = useState("");

  const phone = "32468133331";  
  const methods = ["ويسترن يونيون", "ريا", "UPT", "بنكي", "محفظة"]; // تم إضافة بنكي ومحفظة

  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwWDBB6yYXnFVXSzH8jWk3_hE9I01uyNv1_BIVyShqjaYsfwTlOraC4DQBpqwcTNah7dnb9Aau537n/pub?gid=0&single=true&output=csv";

  useEffect(() => {
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
  }, []);

  const handleWhatsApp = (msg?: string) => {
    const message = msg || `مرحباً، أريد طلب حساب.\nالدولة: ${country}\nطريقة التحويل: ${transferMethod}\nبيانات الحساب:\n${accounts[country]}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  const filteredCountries = Object.keys(accounts).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const isAvailable = accounts[country] && (accounts[country].includes(transferMethod) || transferMethod === "اختر طريقة التحويل");

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      <Navbar/>
      <Head><title>طلب حساب</title></Head>

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/money.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/10 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4 border border-[#D4AF37]/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-black text-white drop-shadow-md">طلب حساب</h1>
        </div>

        {isLoading ? <p className="text-white">جاري التحميل...</p> : !showAccount ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (country !== "اختر الدولة" && transferMethod !== "اختر طريقة التحويل") setShowAccount(true); }}>
            
            {/* اختيار الدولة (نفس التصميم السابق) */}
            <div className="w-full relative">
              <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenCountry(!isOpenCountry)}>
                <span>{country}</span>
                <span className="text-[#D4AF37]">▼</span>
              </div>
              {isOpenCountry && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
                  <input placeholder="ابحث..." className="w-full p-2 bg-transparent border-b border-[#D4AF37] text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  {filteredCountries.map(c => (
                    <div key={c} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setCountry(c); setIsOpenCountry(false); }}>{c}</div>
                  ))}
                </div>
              )}
            </div>

            {/* اختيار طريقة التحويل (بنفس تصميم القائمة المنسدلة) */}
            <div className="w-full relative">
              <div className="w-full bg-black/30 border border-white/20 p-4 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center" onClick={() => setIsOpenMethod(!isOpenMethod)}>
                <span>{transferMethod}</span>
                <span className="text-[#D4AF37]">▼</span>
              </div>
              {isOpenMethod && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-[#D4AF37] rounded-xl max-h-40 overflow-y-auto p-2 z-[999]">
                  {methods.map(m => (
                    <div key={m} className="p-3 hover:bg-[#D4AF37] cursor-pointer text-white font-bold text-right" onClick={() => { setTransferMethod(m); setIsOpenMethod(false); }}>{m}</div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg">طلب الحساب</button>
          </form>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            {isAvailable ? (
              <div className="bg-black/30 border border-[#D4AF37] p-3 rounded-xl text-white font-bold text-right w-full">
                <p className="text-[#D4AF37] text-sm">بيانات {country} ({transferMethod}):</p>
                <div className="text-sm mt-2">{accounts[country]}</div>
              </div>
            ) : (
              <p className="text-red-500 font-bold p-4">عذراً، طريقة التحويل {transferMethod} غير متوفرة لهذه الدولة حالياً.</p>
            )}
            
            <div className="w-full bg-white/10 p-3 rounded-xl text-xs text-white text-right">
              <p className="text-[#D4AF37] font-bold mb-1">تعليمات هامة:</p>
              <p>• تأكد من صحة البيانات قبل التحويل.</p>
              <p>• احتفظ بصورة الإيصال بعد إتمام العملية.</p>
            </div>

            <div className="w-full space-y-3">
              {isAvailable && <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">نسخ البيانات</button>}
              <button onClick={() => handleWhatsApp()} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">اطلب عبر واتساب</button>
              <button onClick={() => setShowAccount(false)} className="text-white/70 underline text-sm">رجوع</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}