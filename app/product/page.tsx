'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/app/component/Footer';
import '@/app/ui/globals.css'

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  github: string;
  blog: string;
  created_at: string;
  updated_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/product/all')
      .then((res) => res.json())
      .then((data) => {
        // Sort products by created date (newest first)
        const sortedProducts = (data as Product[]).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setProducts(sortedProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
          <Link href="/products" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Kawa Products</h1>
          </Link>
          <div className="flex space-x-2">
            <Link href="/" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">TOP</Link>
            <Link href="/about" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">ABOUT</Link>
            <Link href="/blog" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">BLOG</Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl p-4 md:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">作品情報を読み込み中...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 mt-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden p-6 hover:shadow-lg transition duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={product.image_url || "/images/kawa_logo.jpg"} 
                      alt={product.title} 
                      className="w-full h-auto rounded-md object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>
                    
                    <div className="flex items-center mt-4 space-x-4">
                      {product.github && (
                        <a 
                          href={product.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-blue-600"
                        >
                          <img src="/images/GitHub.svg" alt="GitHub" className="w-6 h-6 mr-1" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {product.blog && (
                        <a 
                          href={product.blog} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Blog記事
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-sm mt-4">
                      更新日: {new Date(product.updated_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow-md rounded-lg p-8 mt-6">
            <h3 className="text-xl font-medium text-gray-700">作品情報がありません</h3>
            <p className="text-gray-500 mt-2 text-center">しばらくお待ちください。作品情報が追加される予定です。</p>
          </div>
        )}
      </div>

      <Footer siteName="Kawa_ Products" adminName="Kawa_" />
    </main>
  );
}