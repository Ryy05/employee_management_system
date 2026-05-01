'use client'
import { useState } from 'react';
import { Plus_Jakarta_Sans } from "next/font/google"; // Import Plus Jakarta Sans font
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Using the Plus Jakarta Sans font from Google Fonts
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });  // Metropolis Sans Saf

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient()); // Initialize QueryClient here

  const defaultTitle = "EMS Admin Panel";
  const defaultDescription = "Employee Management System Admin Panel";

  return (
    <html lang="en">
      <head><title>{defaultTitle}</title></head>
      <body className={plusJakartaSans.className}> {/* Apply the font to the body */}
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer />
          </QueryClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
