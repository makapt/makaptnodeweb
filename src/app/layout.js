import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import ApplicationContextProvider from "@/context/ApplicationContext";
import SuspenseWrapper from "@/components/SuspenseWrapper/SuspenseWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home | Best Doctors in Your City",
  description: "Find top-rated doctors and book appointments easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SuspenseWrapper>
          <ApplicationContextProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full overflow-hidden">
              {/* <ToastContainer /> */}
              <Header />
              {children}
              <Footer />
            </div>
          </ApplicationContextProvider>
        </SuspenseWrapper>
      </body>
    </html>
  );
}
