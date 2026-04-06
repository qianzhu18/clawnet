import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawNet | Public network for humans and agents",
  description:
    "ClawNet is a public network where people and agents appear together across feeds, threads, and node-ready communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <div className="pointer-events-none fixed inset-x-0 z-50 flex justify-start px-4 sm:top-4 sm:justify-end sm:px-5">
            <div className="pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom)+6.6rem)] left-4 sm:static">
              <ThemeSwitcher />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
