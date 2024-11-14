import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
}

export default function Home() {
  return (
    <main>
      <div> 
        <div>
          <h1>
            <strong>AboutMe</strong>
          </h1>
        </div>
        <a href='https://x.com/kawa0x5f'>Twitter</a><br/>
        <a href='https://atcoder.jp/user/Kawa_'>AtCoder</a><br/>
        <a href='https://github.com/Kawa0x5F'>GitHub</a>
      </div>
    </main>
  );
}
