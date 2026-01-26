"use client"
import BottomNav from "@/components/user/bottomNav";
import TopNav from "@/components/user/sections/valentine/topNav";
import { UserAuthProvider } from "@/hooks/UserAuthProvider";
import { useUser } from "@clerk/nextjs";


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();

  return (
   <div className="">
    <UserAuthProvider clerkId={user?.id}>
      <TopNav/>
      {children}
    </UserAuthProvider>
      {/* Main content area - takes available space */}
      
    
       
    </div>
  );
}
