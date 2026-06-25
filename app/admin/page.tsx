"use client";

import { useEffect, useState } from "react";

interface Currency {
  id: number;
  name: string;
  buy_price: number;
  sell_price: number;
}

export default function AdminPage() {
  const ADMIN_EMAIL = "admin@dollartop.com";
  const ADMIN_PASSWORD = "15123";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  useEffect(() => {
    const isLogged = sessionStorage.getItem("admin_logged_in");
    if (isLogged === "true") setIsAuthenticated(true);

    fetch("/api/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(Array.isArray(data) ? data : (data.currencies || [])))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_logged_in", "true");
      setIsAuthenticated(true);
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
    }
  };

  const updateField = (id: number, field: keyof Currency, val: string) => {
    setCurrencies((prev) => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const save = async (c: Currency) => {
    setSavingId(c.id);
    try {
      const res = await fetch("/api/currencies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.ok) showToast("تم التحديث بنجاح ✅");
      else showToast("حدث خطأ أثناء التحديث");
    } catch {
      showToast("تعذر الاتصال بالخادم");
    } finally {
      setSavingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700">
          <h2 className="text-white text-xl font-bold mb-6 text-center">بوابة الإدارة</h2>
          
          <input 
            type="email" 
            placeholder="البريد الإلكتروني"
            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-lg text-white text-lg font-bold placeholder-slate-500 outline-none focus:border-amber-500 appearance-none mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="كلمة المرور"
            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-lg text-white text-lg font-bold placeholder-slate-500 outline-none focus:border-amber-500 appearance-none mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-bold mb-4 text-center bg-red-500/10 p-2 rounded">
              {error}
            </p>
          )}

          <button className="w-full bg-amber-500 hover:bg-amber-400 py-3 rounded-lg font-black transition-all">
            تسجيل الدخول
          </button>

          <button 
            type="button" 
            onClick={() => window.history.back()}
            className="w-full text-slate-500 hover:text-white transition-colors text-sm font-bold mt-6 underline"
          >
            العودة
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="text-white text-center mt-20">جاري الاتصال بالسيرفر...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans relative">
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 bg-slate-800 border-l-4 border-amber-500 text-white p-4 rounded shadow-2xl flex items-center gap-3">
          <p className="font-bold">{toast.msg}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-slate-700 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">DOLLAR TOP <span className="text-amber-500">ADMIN</span></h1>
            <p className="text-slate-400 mt-2">لوحة التحكم الخاصة بالإدارة</p>
          </div>
          <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="text-red-400 hover:text-red-300 text-sm font-bold">تسجيل الخروج</button>
        </header>

        <div className="grid gap-4">
          {currencies.map((c) => (
            <div key={c.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
              <div className="w-full md:w-32">
                <h3 className="text-white font-bold text-lg">{c.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="relative">
                  <span className="absolute -top-3 right-2 bg-slate-800 text-[10px] text-amber-500 px-2 uppercase font-bold">شراء</span>
                  <input className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-lg font-bold text-center font-mono focus:border-amber-500 outline-none appearance-none" value={c.buy_price} onChange={(e) => updateField(c.id, 'buy_price', e.target.value)} />
                </div>
                <div className="relative">
                  <span className="absolute -top-3 right-2 bg-slate-800 text-[10px] text-amber-500 px-2 uppercase font-bold">بيع</span>
                  <input className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-lg font-bold text-center font-mono focus:border-amber-500 outline-none appearance-none" value={c.sell_price} onChange={(e) => updateField(c.id, 'sell_price', e.target.value)} />
                </div>
              </div>
              <button onClick={() => save(c)} className="w-full md:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-all active:scale-95 whitespace-nowrap">
                {savingId === c.id ? "جاري..." : "تحديث"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


