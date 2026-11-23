import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semana Acadêmica",
  description: "Inscrições, presença e certificados em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
