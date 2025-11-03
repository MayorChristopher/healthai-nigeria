import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthAI Nigeria - Free Medical Advice 24/7",
  description: "AI-powered medical assistant for Nigerian communities. Get instant symptom analysis in English and Pidgin. Find nearby hospitals. Available 24/7.",
  keywords: ["Nigeria", "healthcare", "AI", "medical advice", "Pidgin", "emergency", "hospital finder"],
  authors: [{ name: "Mayor Christopher", url: "https://github.com/MayorChristopher" }],
  openGraph: {
    title: "HealthAI Nigeria - Free Medical Advice 24/7",
    description: "AI-powered medical assistant for Nigerian communities. Available in English and Pidgin.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthAI Nigeria - Free Medical Advice 24/7",
    description: "AI-powered medical assistant for Nigerian communities. Available in English and Pidgin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
