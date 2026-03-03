import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathlight",
  description: "AI-Powered Mental Health Support for Students",
};

import LanguageSelector from "./components/LanguageSelector";
import AnalyticsProvider from "./components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <LanguageSelector />
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
