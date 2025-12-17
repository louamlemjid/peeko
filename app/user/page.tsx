import Slider from "@/components/user/sections/animations/slider";
import PeekoCode from "@/components/user/sections/peekoCode/peekoCode";
import Chat from "@/components/user/sections/valentine/chat";


export default function UserPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center bg-background pt-16">
      <PeekoCode code="A4B9K8P" label="Peeko verification code" />
      <Slider/>
      <Chat/>
    </div>
  );
}