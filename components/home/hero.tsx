import Image from "next/image"
import Link from "next/link"
import { Video } from "../ui/video"


export default function HeroSection() {
    return(
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            {/* Left - Text + Features + CTAs */}
            <div className="space-y-12 md:space-y-16 relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-200">
                Why Choose
                <br />
                <span className="bg-gradient-to-r from-[#FE7F2D] to-primary  bg-clip-text text-transparent">
                  Peeko?
                </span>
              </h1>

             {/* Mobile Image - smaller & centered */}
            <div className="lg:hidden relative mt-12 flex justify-center">
              <div className="relative w-64 sm:w-80 max-w-full">
                <div className="relative rounded-3xl  border border-primary/30 shadow-2xl shadow-primary/50">
                  {/* <Image
                    src="/peekoPoster.jpg"
                    alt="Peeko AI Agent - Mobile"
                    width={320}
                    height={520}
                    className="w-full h-auto "
                    priority
                  /> */}
                  <Video/>
                </div>

              </div>
            </div>

              {/* CTA Buttons - visible on all sizes */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-8">
                <Link
                  href="/user"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full bg-gradient-to-r from-[#FE7F2D] to-primary hover:from-[#FE7F2D] hover:to-violet-500 transition-all shadow-lg shadow-[#FE7F2D]/40 transform hover:scale-105"
                >
                  Join Now
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full border border-primary/50 bg-black/30 backdrop-blur-sm hover:bg-white/5 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right - Cinematic Image (hidden on mobile, shown from lg+) */}
            <div className="relative hidden lg:block">
              <div className="relative h-[680px] flex items-center justify-center -mr-8">
                {/* Glow + vignette */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10 rounded-3xl" /> */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE7F2D]/10 via-primary/15 to-transparent blur-3xl animate-pulse-slow z-0" />

                <div className="relative z-20 transform -rotate-3 scale-105 transition-transform duration-700 hover:rotate-0 hover:scale-110">
                  <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/60">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
                    {/* <Image
                      src="/peekoPoster.jpg"
                      alt="Peeko AI Agent - Cinematic"
                      width={420}
                      height={680}
                      className="object-cover brightness-90 contrast-110 saturate-125 drop-shadow-2xl"
                      priority
                    /> */}
                    <Video/>
                  </div>
                </div>

                {/* Accent glows */}
                <div className="absolute top-20 -left-10 w-32 h-32 bg-[#FE7F2D]/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-32 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
              </div>
            </div>

            
            
          </div>
    )
}