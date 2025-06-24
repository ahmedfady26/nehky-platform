"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800">
      <h1 className="text-3xl font-bold mb-4">حدث خطأ غير متوقع</h1>
      <p className="mb-6">{error.message || "عذراً، حدث خطأ أثناء تحميل الصفحة."}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
