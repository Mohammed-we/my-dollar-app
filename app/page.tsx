"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import Head from 'next/head';

export default function UserInterface() {
  const [country, setCountry] = useState("اختر الدولة");
  const [method, setMethod] = useState("طريقة التحويل");
  const [showAccount, setShowAccount] = useState(false);
  const [accounts, setAccounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isOpenCountry, setIsOpenCountry] = useState(false);
  const [isOpenMethod, setIsOpenMethod] = useState(false);

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
      error: (err) => {
        console.error("خطأ في جلب البيانات:", err);
        setError(true);
        setIsLoading(false);
      },
    });
  }, []);

  const methods = [
    "ويسترن يونيون",
    "موني جرام",
    "ريا",
    "حساب بنكي",
    "محفظة إلكترونية",
  ];

  const handleWhatsApp = () => {
    const phone = "966500000000";
    const message = `مرحباً، أريد طلب حساب.
الدولة: ${country}
طريقة التحويل: ${method}

بيانات الحساب المطلوبة:
${accounts[country]}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ رقم الحساب بنجاح، يمكنك لصقه الآن!");
  };

  const Dropdown = ({ value, options, onSelect, isOpen, setIsOpen }: any) => (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/15 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-4 text-white text-lg cursor-pointer flex justify-between items-center"
      >
        {value} <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {options.map((opt: string, i: number) => (
            <div 
              key={i} 
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              className="p-4 hover:bg-[#D4AF37]/20 text-black cursor-pointer transition-colors text-right"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      <Head>
        <link rel="icon" href="/favicon.jpeg" />
        <title>طلب حساب</title>
      </Head>

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/money.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm border border-white/10 text-center transition-all duration-500">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4 border border-[#D4AF37]/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-white">طلب حساب</h1>
        </div>

        {isLoading ? (
          <p className="text-white">جاري تحميل البيانات...</p>
        ) : error ? (
          <p className="text-red-400">حدث خطأ في تحميل البيانات.</p>
        ) : !showAccount ? (
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (country !== "اختر الدولة" && method !== "طريقة التحويل") setShowAccount(true);
          }}>
            <Dropdown value={country} options={Object.keys(accounts)} onSelect={setCountry} isOpen={isOpenCountry} setIsOpen={setIsOpenCountry} />
            <Dropdown value={method} options={methods} onSelect={setMethod} isOpen={isOpenMethod} setIsOpen={setIsOpenMethod} />
            <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl shadow-lg animate-pulse hover:animate-none">طلب الحساب</button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-[#D4AF37]/20 border border-[#D4AF37] p-6 rounded-xl text-white font-bold text-right" style={{ whiteSpace: "pre-line" }}>
              <p className="mb-3 text-[#D4AF37] text-lg">بيانات الحساب لـ {country}:</p>
              <div className="whitespace-pre-line break-words leading-8 text-base">{accounts[country]}</div>
            </div>
            <button onClick={() => copyToClipboard(accounts[country])} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg">نسخ البيانات</button>
            <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600">اطلب حساب</button>
            
            {/* زر الخروج الذي يوجه المستخدم لصفحة أخرى */}
            <button onClick={() => window.location.href = "https://www.google.com"} className="text-white/50 underline text-sm">
              خروج
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
