'use client'; // これでクライアントコンポーネントとして指定

import { useState } from 'react';
import Link from 'next/link';

interface CardItemProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function CardItem({ title, description, href, icon }: CardItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 
        flex flex-col items-center justify-center 
        bg-white bg-opacity-80 backdrop-blur-sm 
        shadow-lg rounded-2xl 
        transition-all duration-300 
        ${isHovered ? 'transform -translate-y-2 shadow-xl' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={href} 
        className="w-full h-full flex flex-col items-center justify-center p-4"
      >
        <span className="text-2xl mb-2">{icon}</span>
        <span className="text-lg sm:text-xl font-semibold text-indigo-800">{title}</span>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">{description}</p>
      </Link>
    </div>
  );
}