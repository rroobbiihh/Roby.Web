import { ImageResponse } from "next/og";

export const alt = "Roby De Vera — Video Editor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background:
            "radial-gradient(60% 60% at 25% 20%, rgba(196,123,90,0.25), transparent 65%), #0e0e0e",
          color: "#f5f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#97907f",
          }}
        >
          Video Editor
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            marginTop: 16,
          }}
        >
          Roby De Vera<span style={{ color: "#c47b5a" }}>.</span>
        </div>
      </div>
    ),
    size
  );
}
