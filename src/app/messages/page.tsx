"use client";
// صفحة الرسائل الخاصة
import React, { useState } from 'react';
import InputWithLogo from '@/components/InputWithLogo';

export default function MessagesPage() {
  // بيانات محادثات افتراضية
  const conversations = [
    { id: 1, name: "سارة محمد", lastMessage: "شكراً على الرد!" },
    { id: 2, name: "محمد علي", lastMessage: "سأرسل التفاصيل لاحقاً." },
    { id: 3, name: "د. ريم خالد", lastMessage: "تم استلام الملف." },
  ];
  const [selected, setSelected] = useState(1);

  // رسائل افتراضية
  const messages = [
    { id: 1, fromMe: false, text: "مرحباً!" },
    { id: 2, fromMe: true, text: "أهلاً وسهلاً، كيف يمكنني مساعدتك؟" },
    { id: 3, fromMe: false, text: "أحتاج مساعدة في المنصة." },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-400 to-green-300 font-tajawal text-right p-6">
      <h1 className="text-3xl font-bold mb-4">الرسائل الخاصة</h1>
      <div className="flex max-w-4xl mx-auto bg-white/80 rounded-lg shadow overflow-hidden" style={{height: 500}}>
        {/* قائمة المحادثات */}
        <aside className="w-1/3 bg-blue-50 border-l border-blue-100 p-4 overflow-y-auto">
          <h2 className="font-bold mb-2">المحادثات</h2>
          <ul>
            {conversations.map(conv => (
              <li
                key={conv.id}
                className={`p-2 rounded cursor-pointer mb-2 ${selected === conv.id ? 'bg-blue-200 font-bold' : 'hover:bg-blue-100'}`}
                onClick={() => setSelected(conv.id)}
              >
                <div>{conv.name}</div>
                <div className="text-xs text-gray-500">{conv.lastMessage}</div>
              </li>
            ))}
          </ul>
        </aside>
        {/* منطقة الرسائل */}
        <section className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map(msg => (
              <div key={msg.id} className={`mb-2 flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.fromMe ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          {/* إدخال رسالة جديدة */}
          <form className="flex gap-2">
            <InputWithLogo
              type="text"
              placeholder="اكتب رسالة..."
              showLogo={true}
              logoPosition="right"
              className="flex-1"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">إرسال</button>
          </form>
        </section>
      </div>
    </main>
  );
}
