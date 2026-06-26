import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // هذا هو السطر الأهم للعمل على Netlify
  images: {
    unoptimized: true, // ضروري لأن Netlify لا يدعم تحسين الصور التلقائي في وضع الـ export
  },
};

export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   allowedDevOrigins: ['192.168.1.7', 'localhost'],
//   // أي إعدادات تانية خاصة بالمشروع سيبها زي ما هي
// };

// module.exports = nextConfig;




// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;