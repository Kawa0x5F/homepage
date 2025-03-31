"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import '@/app/ui/globals.css'

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // エラーをリセット
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data: { result?: string; error?: string } = await res.json();

    if (res.ok && data.result === "success") {
      router.push("/admin");
    } else {
      setError(data.error || "ログインに失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* クリックでトップページに戻るロゴ */}
      <Image
        src="/images/kawa_logo.png"
        alt="Kawa Logo"
        width={100}
        height={100}
        className="cursor-pointer mb-4"
        onClick={() => router.push("/")}
      />

      <h1 className="text-2xl mb-4">管理者ログイン</h1>

      <input
        type="text"
        className="border p-2 mb-2"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 mb-2"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white">
        ログイン
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* トップページに戻るボタン */}
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white"
      >
        トップページへ戻る
      </button>
    </div>
  );
}
