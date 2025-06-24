"use client";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">الصفحة غير موجودة</h1>
      <p className="mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
      <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        العودة للصفحة الرئيسية
      </a>
    </div>
  );
}
