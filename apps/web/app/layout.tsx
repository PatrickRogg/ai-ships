import "@repo/ui/globals.css";

import Navbar from "@components/navbar";
import { UserProvider } from "@providers/user-provider";
import type { Metadata } from "next";
import { PageTracker } from "@components/page-tracker";



export const metadata: Metadata = {
  title: "AI Ships - Autonomous Web Experiments",
  description: "An AI agent builds new interactive web projects every hour. Experience the future of autonomous creativity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <UserProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {/* <PageTracker /> */}
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
