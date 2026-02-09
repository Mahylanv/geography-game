import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GeoDex — Jeu de géographie";

const logoPath = path.join(process.cwd(), "public", "logo.png");
const logoData = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(900px 420px at 10% -10%, rgba(14,165,233,0.55), transparent 60%)," +
            "radial-gradient(900px 420px at 90% -10%, rgba(251,146,60,0.5), transparent 60%)," +
            "radial-gradient(900px 420px at 50% 110%, rgba(34,197,94,0.4), transparent 65%)," +
            "linear-gradient(180deg, #f8fafc 0%, #e2ebf7 100%)",
          fontFamily: "'Space Grotesk', 'Manrope', Arial, sans-serif",
          color: "#0f172a"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "48px 64px",
            borderRadius: 40,
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 30px 60px rgba(15, 23, 42, 0.12)",
            border: "1px solid rgba(255,255,255,0.6)"
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 28,
              background: "rgba(15, 23, 42, 0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img src={logoSrc} width={120} height={120} alt="Logo GeoDex" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>GeoDex</div>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#14b8a6", marginTop: 10 }}>
              Jeu de géographie
            </div>
            <div style={{ fontSize: 26, color: "#475569", marginTop: 18 }}>
              Quiz de drapeaux • capitales • pays
            </div>
            <div style={{ fontSize: 20, color: "#64748b", marginTop: 10 }}>
              Auteur : Mahylan VECLIN
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
