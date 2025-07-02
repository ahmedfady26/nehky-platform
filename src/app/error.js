"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h2>حدث خطأ غير متوقع!</h2>
      <p>{error?.message || 'يرجى إعادة تحميل الصفحة.'}</p>
      <button onClick={() => reset()} style={{marginTop: 20, padding: 10}}>إعادة المحاولة</button>
    </div>
  );
}