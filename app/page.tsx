import type { Metadata } from 'next'
import Image from 'next/image'
import './ui/globals.css'

export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
}

export default function Home() {
  return (
    <main>
      <div> 
        <div>
          <h1><strong>AboutMe</strong></h1>
        </div>

          <div className="flex flex-row">
            <Image 
              src="/snsProfile.png"
              alt="Kawa_Cat. This icon is used by Kawa_ on SNS."
              width={512}
              height={512}

              sizes='100vw'
              style={{
                width: '15%',
                height: 'auto',
              }}
            />
            <div>
              <h2>Kawa_</h2>
              <p>AtCoder 茶 /「努力はしないと始まらない」</p>
            </div>
        </div>
        <a href='https://x.com/kawa0x5f'>Twitter</a><br/>
        <a href='https://atcoder.jp/user/Kawa_'>AtCoder</a><br/>
        <a href='https://github.com/Kawa0x5F'>GitHub</a>
      </div>
    </main>
  );
}
