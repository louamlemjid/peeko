import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "user",
  description: "user peeko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >
        <div className="">
          {children}
        </div>
      </div>
  );
}
