import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sneakora — Premium Sneakers",
  description:
    "Premium sneakers for every step. Streetwear culture meets performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Toaster
          position="bottom-left"
          gap={12}
          offset={24}
          visibleToasts={3}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "group flex items-start gap-3 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl px-4 py-3 text-sm shadow-lg ring-1 ring-foreground/5",
              title: "text-foreground font-medium text-sm",
              description: "text-muted-foreground text-xs mt-0.5",
              icon: "shrink-0 mt-0.5",
              success:
                "border-l-[3px] border-l-accent",
              error:
                "border-l-[3px] border-l-destructive",
              closeButton:
                "absolute right-2 top-2 flex size-5 items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-colors",
            },
          }}
        />
      </body>
    </html>
  );
}
