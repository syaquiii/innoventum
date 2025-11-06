"use client"
import Image from "next/image";
import { langList } from "../data/langlist";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <div
      className="bg-white"
    >
      <div className="mycontainer p-40 flex flex-col gap-30">
        <div className="justify-center">
          <h2 className="font-bold text-6xl text-end">
            Be part of <span className="text-normal">innovation</span>.
          </h2>
          <h2 className="font-bold text-6xl">
            Join <span className="text-normal">Innoventum</span> now!
          </h2>
        </div>
        <div className="space-y-5 flex flex-col items-center">
          <h2 className="font-bold text-6xl text-center">
            Langganan
          </h2>
          <div className="flex gap-5 mt-16">
            {langList.map((item) => (
              <div key={item.id} className="flex flex-col items-center space-y-4 bg-light rounded-2xl pl-6 pb-6 pr-6 pt-14 flex-1 hover:scale-105 hover:bg-light-active transition-all">
                <div className="h-20 w-20 p-4 bg-white rounded-[100%] mt-[-95] shadow-lg">
                  <Image src={item.img} alt="" />
                </div>
                <h1 className="font-bold text-xl">
                  {item.label}
                </h1>
                <p className="text-center">
                  {item.desc}
                </p>
              </div>
            ))}
            
          </div>
        </div>
        <Button variant="normal" className="scale-140 mx-95 cursor-pointer hover:scale-150">
          Langganan Sekarang
        </Button>

      </div>

    </div>
  )
}

export default CallToAction