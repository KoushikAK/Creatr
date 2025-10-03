import { Jost } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export const jost = Jost({
  subsets: ['latin'], // Specify the necessary subsets
  display: 'swap', // Recommended for better font loading experience
  weight: ['400', '700'], // Specify the weights you need, or use 'variable' if available
});

export const metadata = {
  title: "AI Content Platform - Creatr",
  description: "Content generation made easy with AI",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jost.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              baseTheme: neobrutalism,
            }}
          >
            <ConvexClientProvider>
              <Header />
              <main className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
                {children}
              </main>
              <Toaster richColors />
              {/* <Footer /> */}
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
