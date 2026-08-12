import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nickolas Franklin | Technical Program Manager & Solutions Engineer",
  description: "Technical portfolio showcasing AI program management, solutions engineering, and enterprise software delivery across commercial and mission-critical environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        
        {/* Global Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-6 sm:px-12 h-16 flex items-center justify-end">
            
            {/* Nav Links */}
            <div className="flex gap-8 text-sm font-semibold text-slate-400">
              <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                Projects
              </Link>
              <Link href="/experience" className="hover:text-emerald-400 transition-colors">
                Experience
              </Link>
            </div>
            
          </div>
        </nav>

        {/* Main Page Content wrapper with padding to offset the fixed navbar */}
        <div className="pt-16">
          {children}
        </div>
        
      </body>
    </html>
  );
}