export default function BackgroundText() {
    return (
      <div className="fixed bottom-8 right-8 w-auto h-auto flex items-end pointer-events-none">
        <p
          className="font-bold text-gray-300 opacity-20 leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 45vw, 45vh)",
            width: "100%",
            maxWidth: "100%", // 最大幅を設定し、親要素に収まるようにする
          }}
        >
          Kawa_
        </p>
      </div>
    );
  }
  