import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import ToastContainer from "@/components/toast/ToastContainer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthInitializer from "@/components/providers/AuthInitializer";
import AccountModal from "@/components/account/AccountModal";

export const metadata: Metadata = {
  title: { default: "Whizz Kitchen", template: "%s | Whizz Kitchen" },
  description: "Fresh, made-to-order snacks and recipes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col ">  
        <ReduxProvider>
          <AuthInitializer>
            <Header />
          <MobileMenu />
          <CartDrawer />
          <AccountModal />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
          </AuthInitializer>
          
         
        </ReduxProvider>
      </body>
    </html>
  );
}