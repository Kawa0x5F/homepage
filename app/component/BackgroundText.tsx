export default function BackgroundText() {
  return (
    <div className="fixed bottom-8 right-8 w-auto h-auto flex items-end pointer-events-none">
      <p
        className="font-bold text-[#d2b48c] opacity-20 leading-none whitespace-nowrap 
                   text-8xl sm:text-10xl md:text-[12rem] lg:text-[15rem] xl:text-[20rem]"
        style={{
          fontSize: "clamp(8rem, 20vw, 30rem)", // 画面幅の 20% を基準に拡大
        }}
      >
        Kawa_
      </p>
    </div>
  );
}
