
// pages/sign-in/[[...sign-in]].jsx (or wherever your SignIn component is)
import { SignIn } from "@clerk/nextjs";
export default function Page() {
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', // Centers horizontally
      alignItems: 'center',     // Centers vertically
      minHeight: '100vh',       // Ensures the container takes full viewport height
      width: '100vw',           // Ensures the container takes full viewport width
      
    }}>
      <SignIn 
      fallbackRedirectUrl={"/user"}
       />
    </div>
  );
}