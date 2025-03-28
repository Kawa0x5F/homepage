'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/app/component/Footer';
import '@/app/ui/globals.css'

interface Tag {
  id: number;
  tag_name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[] | string[] | null;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/articles/publish').then((res) => res.json()),
      fetch('http://localhost:8080/tags/all').then((res) => res.json())
    ])
    .then(([articlesData, tagsData]) => {
      // Ensure tags is an array of Tag type, default to empty array if null or not an array
      const safeTags: Tag[] = Array.isArray(tagsData) ? tagsData : [];
      
      // Sort articles and ensure tags are processed safely
      const processedArticles = (articlesData as Article[]).map(article => ({
        ...article,
        // Ensure tags is always an array, converting to empty array if null
        tags: Array.isArray(article.tags) ? article.tags : []
      })).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setArticles(processedArticles);
      setTags(safeTags);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setArticles([]);
      setTags([]);
      setLoading(false);
    });
  }, []);

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const filteredArticles = selectedTags.length > 0
    ? articles.filter(article => 
        article.tags && article.tags.some(tag => 
          typeof tag !== 'string' && selectedTags.includes(tag.id)
        )
      )
    : articles;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
          <Link href="/blog" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Kawa Blog</h1>
          </Link>
          <div className="flex space-x-2">
            <Link href="/" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">TOP</Link>
            <Link href="/about" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">ABOUT</Link>
            <Link href="/products" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">PRODUCT</Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl p-4 md:p-6 lg:p-8">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">タグでフィルター:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTagSelection(tag.id)}
                />
                <span className="text-sm text-gray-700">{tag.tag_name}</span>
              </label>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">記事を読み込み中...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredArticles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="block">
                <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 hover:shadow-lg transition duration-300 h-full flex flex-col">
                <img 
                  src={article.image_url || "/images/kawa_logo.jpg"} 
                  alt={article.title} 
                  className="w-full object-cover"
                />
                  <h2 className="text-xl font-semibold line-clamp-2">{article.title}</h2>
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span key={typeof tag === 'string' ? tag : tag.id} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                          {typeof tag === 'string' ? tag : tag.tag_name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-4">
                    <p className="text-gray-500 text-sm">
                      更新日: {new Date(article.updated_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow-md rounded-lg p-8 mt-6">
            <h3 className="text-xl font-medium text-gray-700">該当する記事がありません</h3>
            <p className="text-gray-500 mt-2 text-center">別のタグを選択するか、新しい記事が追加されるのをお待ちください。</p>
          </div>
        )}
      </div>

      <Footer siteName="Kawa_ Blog" adminName="Kawa_" />
    </main>
  );
}