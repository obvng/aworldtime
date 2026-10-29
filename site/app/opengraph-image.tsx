import { ImageResponse } from "next/og";

export const alt = "AWORLDTIME.COM world clock";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", color: "#06123c", background: "linear-gradient(135deg, #edf8ff 0%, #ffffff 55%, #e4f2ff 100%)", fontFamily: "Arial, sans-serif" }}>
        <div style={{ position: "absolute", width: 430, height: 430, right: -80, top: -75, display: "flex", border: "2px solid #bcdcff", borderRadius: 999 }} />
        <div style={{ position: "absolute", width: 265, height: 265, right: 5, top: 8, display: "flex", border: "2px solid #d7eaff", borderRadius: 999 }} />
        <div style={{ position: "absolute", width: 126, height: 126, right: 75, top: 77, display: "flex", borderRadius: 999, background: "#ffbd2e", boxShadow: "0 0 0 25px #ffe69b" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, display: "flex", opacity: .8, background: "linear-gradient(180deg, transparent, #b9dcff)" }} />
        <main style={{ width: "100%", padding: "72px 82px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
            <span style={{ width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #1769ea", borderRadius: 999, color: "#1769ea", fontSize: 34 }}>◉</span>
            AWORLDTIME.COM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ margin: 0, color: "#1769ea", fontSize: 25, fontWeight: 700 }}>WORLD CLOCK</p>
            <h1 style={{ maxWidth: 760, margin: "12px 0 18px", fontSize: 76, lineHeight: 1.02, letterSpacing: -4 }}>The right time, anywhere.</h1>
            <p style={{ margin: 0, color: "#425777", fontSize: 30 }}>Live city clocks · UTC offsets · Sunrise and sunset</p>
          </div>
        </main>
      </div>
    ),
    size,
  );
}
