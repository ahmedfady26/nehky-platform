export default function NotFound() {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h2>الصفحة غير موجودة</h2>
      <p>عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
      <a href="/" style={{color: '#059669', textDecoration: 'underline'}}>العودة للرئيسية</a>
    </div>
  );
}