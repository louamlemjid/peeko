import BottomNav from "@/components/user/bottomNav";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "chat",
  description: "chat peeko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="">
      {/* Main content area - takes available space */}
      <main className="">{children}</main>
       
    </div>
  );
}
