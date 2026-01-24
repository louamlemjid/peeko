"use client"

import Slider from "@/components/user/sections/animations/slider";
import PeekoCode from "@/components/user/sections/peekoCode/peekoCode";
import Chat from "@/components/user/sections/valentine/chat";
import { useEffect, useState } from "react";
import {useAuth} from "@clerk/nextjs"
import { toast } from "react-toastify";
import PeekoName from "@/components/user/sections/peekoConfig/peekoName";
import PeekoMoodSection from "@/components/user/sections/peekoConfig/peekoMood";
import { IUser } from "@/model/user";
import { IPeeko } from "@/model/peeko";

export enum PeekoMood {
  DEFAULT = "DEFAULT",
  HAPPY = "HAPPY",
  TIRED = "TIRED",
  ANGRY = "ANGRY",
}

export default function UserPage() {
  const [userCode,setUserCode] = useState<string>("")
  const [user,setUser] = useState<IUser|null>(null)
  const [peeko,setPeeko] = useState<IPeeko|null>(null)
  const {userId} = useAuth()
  

  const fetchUser = async ()=>{
    try {
      if(!userId) return

      const fetchedUser = await fetch("/api/v1/user/"+userId,{
        method:"GET",
        headers:{
        'Content-Type': 'application/json', 
      },
      })
      if(!fetchedUser) return

      const data = await fetchedUser.json()
      setUserCode(data.userCode || "")
      setUser(data)
      setPeeko(data.peeko)
      toast.success("Hello "+data.firstName+" !")

    } catch (error) {
      toast.error("Failed to fetch user")
    }
  }

  useEffect(()=>{
    fetchUser()
  },[userId])
  
  return (
    <div className="flex flex-col min-h-screen  bg-background pt-16">
      <div className="bg-gradient-to-b from-background via-primary to-background">
      <PeekoCode code={userCode} label="Peeko verification code" />
      
      <PeekoName peekoCode={userCode} initialName={peeko ? peeko.peekoName : ""} />
      <PeekoMoodSection peekoCode={userCode} initialMood={peeko ? peeko.mood : PeekoMood.DEFAULT} />
      </div>
      {/* <Slider/> */}
     
    </div>
  );
}