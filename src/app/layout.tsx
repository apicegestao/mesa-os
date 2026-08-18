import type { Metadata, Viewport } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Mesa OS",
  description: "Fundação técnica do Mesa OS.",
  applicationName: "Mesa OS",
  icons: {
    icon: "/icon.png?v=4",
    apple: "/apple-icon.png?v=4",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#101D37",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
