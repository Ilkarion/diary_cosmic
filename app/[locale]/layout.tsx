import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import StarryNightBackground from "./components/animatedBg/AnimatBg";
import SidePanel from "./components/sidePanel/SidePanel";
import TokenKeeper from "./tokenKeeper/TokenKeeper";
import ErrorHandler from "./components/errorHandler/ErrorHandler";
import ShowMsg from "./components/showMsg/ShowMsg";
import ServerWakeWatcher from "./components/serverWakeWatcher/ServerWakeWatcher";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourMap",
  description: "For people who love learn anything about this world.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >

      <NextIntlClientProvider >
         <ThemeProvider 
          attribute="data-theme" 
          defaultTheme="dark"
          enableSystem={false}
          storageKey="theme"
          >
            <StarryNightBackground />
            <SidePanel />
            <ServerWakeWatcher />
            <ErrorHandler />
            <TokenKeeper />
            <ShowMsg/>
              {children}
         </ThemeProvider>
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
