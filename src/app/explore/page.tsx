"use client";
// صفحة البحث والاستكشاف
import React, { useState } from 'react';
import InputWithLogo from '@/components/InputWithLogo';

export default function ExplorePage() {
  // نتائج بحث افتراضية
  const [query, setQuery] = useState("");
  const results = [
    { id: 1, name: "سارة محمد", username: "sarahm", type: "مستخدم" },
    { id: 2, name: "منشور عن التقنية", username: "ahmedfady", type: "منشور" },
    { id: 3, name: "محمد علي", username: "mohamedali", type: "مستخدم" },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-400 to-green-300 font-tajawal text-right p-6">
      <h1 className="text-3xl font-bold mb-4">البحث والاستكشاف</h1>
      {/* مربع البحث */}
      <div className="max-w-xl mx-auto mb-6">
        <InputWithLogo
          type="text"
          placeholder="ابحث عن مستخدم أو منشور..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          showLogo={true}
          logoPosition="right"
        />
      </div>
      {/* نتائج البحث */}
      <div className="bg-white/80 rounded-lg shadow p-4 max-w-xl mx-auto">
        <h2 className="text-lg font-bold mb-2">النتائج:</h2>
        <ul className="divide-y divide-blue-100">
          {results.filter(r => r.name.includes(query) || r.username.includes(query)).map(r => (
            <li key={r.id} className="py-2 flex justify-between items-center">
              <span>{r.name} <span className="text-xs text-gray-500">({r.type})</span></span>
              <span className="text-gray-400">@{r.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
