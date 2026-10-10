import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComplianceGuard AI — Autonomous SHEQ & ISO Compliance for South Africa",
  description:
    "Agent-driven Safety Management System for SA retail, franchises, pharmacies and manufacturing. Frictionless incident capture, automated RCA & CAPA, DEL audit readiness and ISO 45001/9001 mapping.",
  applicationName: "ComplianceGuard AI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
    { media: "(prefers-color-scheme: light)", color: "#f7f9fb" },
  ],
};

/** Inline, render-blocking theme resolver — prevents a light→dark flash on load. */
const themeScript = `(()=>{try{const t=localStorage.getItem('cg-theme');const d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch{}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
