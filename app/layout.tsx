import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import UserScripts from "@/components/UserScripts";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Online Screen Recorder - Record & Download Screen Videos",
  description:
    "Capture your screen effortlessly with our browser-based screen recorder. No installations or software needed — just record, review, and download your videos instantly. Ideal for tutorials, presentations, and quick demos, our tool offers smooth, high-quality video recording with simple controls. Save time and boost productivity with our fast and user-friendly screen recording solution.",
  keywords:
    "screen recorder, online screen recorder, record screen online, screen capture, download screen recording",
  openGraph: {
    title: "Online Screen Recorder",
    description:
      "Easily record your screen directly from the browser and download the video instantly. Perfect for tutorials, presentations, and quick demos — no installation required.",
    images: {
      url: "https://ik.imagekit.io/n8rtlkdw8/screen-recorder/screen-recorder-og.png?updatedAt=1733557282285",
    },
    url: "https://screen-recorder.rohankumarthakur.co.in/",
  },
  twitter: {
    card: "summary_large_image",
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
        <UserScripts />
      </body>
    </html>
  );
}
