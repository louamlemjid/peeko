'use client';
import Sidebar from "@/components/dashboard/sideBar";
import React from "react";

export default function DashboradLayout({
    children,   
}:{
    children:React.ReactNode
}){
   
    
        
    return (
        <div className="flex flex-row h-screen bg-gray-100 text-black">
            <Sidebar />
            <main className="flex-1 overflow-y-auto ">
                {children}
            </main>
        </div>
    )
}