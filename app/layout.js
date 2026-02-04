import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareerAI - Personalized Career & Education Advisor",
  description: "AI-powered career guidance platform that helps you build resumes, generate cover letters, prepare for interviews, and receive personalized industry insights.",
  keywords: ["career", "resume", "cover letter", "interview", "AI", "job search"],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
        >
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
