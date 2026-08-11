import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Mesa OS",
  description: "Fundação técnica do Mesa OS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
