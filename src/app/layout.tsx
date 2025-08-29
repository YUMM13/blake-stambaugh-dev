import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blake Stambaugh Developer Page",
  description: "Blake Stambaugh's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      {/* reCAPTCHA script */}
        <Script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        />
      </body>
    </html>
  );
}
