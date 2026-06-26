import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* إعدادات الموقع الأساسية */
  output: 'export', // هذا السطر ضروري جداً لإنشاء مجلد 'out' الذي يحتاجه Netlify
  
  // إذا كنت تستخدم صوراً من مصادر خارجية، يمكنك إضافتها هنا
  images: {
    unoptimized: true, // يفضل تفعيل هذا الخيار عند استخدام 'output: export'
  },

  // إعدادات إضافية يمكن تركها فارغة أو حسب حاجتك
  reactStrictMode: true,
};

export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   allowedDevOrigins: ['192.168.1.7', 'localhost'],
//   // أي إعدادات تانية خاصة بالمشروع سيبها زي ما هي
// };

// module.exports = nextConfig;


