import Head from 'next/head'

export default function Home() {
  return (
    <main>
      <Head>
        <title>Kawa_Web</title>
        <meta name="description" content="Kawa_のホームページです."></meta>
      </Head>

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
