import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import ReduxProvider from "@/components/providers/ReduxProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import ToastContainer from "@/components/toast/ToastContainer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthInitializer from "@/components/providers/AuthInitializer";
import AccountModal from "@/components/account/AccountModal";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f2e9",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-toast) focus:rounded-lg focus:bg-primary-dark focus:px-4 focus:py-2 focus:font-sans focus:font-semibold focus:text-cream focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          Skip to content
        </a>
        <ReduxProvider>
          <AuthInitializer>
            <Header />
            <MobileMenu />
            <CartDrawer />
            <AccountModal />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}