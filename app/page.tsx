"use client";

import { useCallback, useMemo, useState } from "react";
import QRCode from "qrcode";

function normalizeUrl(input: string) {
  let s = input.trim();
  if (!s) return "";
  // Block dangerous schemes
  const bad = /^(javascript:|data:|file:)/i;
  if (bad.test(s)) return "";
  // Add https if missing scheme
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) {
    s = "https://" + s;
  }
  try {
    const u = new URL(s);
    // Optional: force https upgrade
    if (u.protocol === "http:") u.protocol = "https:";
    return u.toString();
  } catch {
    return "";
  }
}
export default function Home() {
  const [input, setInput] = useState("");
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const validUrl = useMemo(() => normalizeUrl(input), [input]);

  const generateAndDownload = useCallback(async () => {
    if (!validUrl) return;
    setIsWorking(true);
    try {
      const dataUrl = await QRCode.toDataURL(validUrl, {
        width: 1024,
        margin: 4,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setPngDataUrl(dataUrl);

      // Trigger instant download
      const a = document.createElement("a");
      const host = (() => { try { return new URL(validUrl).hostname; } catch { return "link"; } })();
      a.href = dataUrl;
      a.download = `qr-${host}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("QR generation failed:", e);
      alert("Sorry, something went wrong generating the QR.");
    } finally {
      setIsWorking(false);
    }
  }, [validUrl]);
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Quick QR Builder</h1>
        <p className="text-sm text-gray-600 mb-6">
          Paste a URL, click once, and your QR code downloads instantly.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com  or  mysite.com/page"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && validUrl && !isWorking) {
                generateAndDownload();
              }
            }}
            aria-invalid={!!input && !validUrl}
          />
          <button
            onClick={generateAndDownload}
            disabled={!validUrl || isWorking}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-3 text-white font-medium disabled:opacity-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isWorking ? "Generating..." : "Generate & Download"}
          </button>
        </div>
        {pngDataUrl && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Preview</p>
            <div className="rounded-lg border bg-white p-3 inline-block">
              <img
                src={pngDataUrl}
                alt="Generated QR code"
                className="h-48 w-48 object-contain"
              />
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          Safety: blocked schemes (javascript:, data:, file:). HTTPS enforced by default.
        </div>
      </div>
    </main>
  );
}
