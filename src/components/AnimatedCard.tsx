// مكون بطاقة مع تأثيرات ناعمة
import React from 'react';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function AnimatedCard({ title, description, icon }: AnimatedCardProps) {
  return (
    <div
      className="group bg-gradient-to-br from-blue-400 to-green-300 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
    >
      <div className="flex items-center gap-4 mb-4">
        {icon && <div className="text-4xl text-white">{icon}</div>}
        <h2 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors">
          {title}
        </h2>
      </div>
      <p className="text-white/80 group-hover:text-white transition-colors">
        {description}
      </p>
    </div>
  );
}
