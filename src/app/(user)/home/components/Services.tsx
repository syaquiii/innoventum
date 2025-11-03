import bg1 from "@/shared/assets/home/Class.jpg";
import bg2 from "@/shared/assets/home/Mentor.jpg";
import bg3 from "@/shared/assets/home/discuss.png";   
import bg4 from "@/shared/assets/home/study.jpg";   

const Services = () => {
  return (
    <div className="bg-dark text-white py-40">
      <div className="mycontainer flex space-x-6">
        <div className="">
          <h1 className="text-6xl font-bold">Layanan</h1>
          <h1 className="text-6xl font-bold">Kami</h1>
        </div>
        <div className=" flex space-x-4">
          <div className="flex-4 text-black space-y-4">
            <div className="relative p-10 rounded-[1.25rem] space-y-2 overflow-hidden bg-white">
              <img src={bg1.src} alt="background" className="h-full w-full object-cover absolute top-0 left-0 object-[20%_20%] z-0 opacity-30" />
              <h1 className="font-bold relative z-1">
                Kelas
              </h1>
              <p className="relative z-1">
                Kelas interaktif dengan pengalaman belajar yang mendorong eksplorasi ide, problem-solving, dan pengembangan keterampilan seru dan kolaboratif.
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white p-10 rounded-[1.25rem] space-y-2 relative overflow-hidden flex-1">
                <img src={bg2.src} alt="background" className="h-full w-full object-cover absolute top-0 left-0 object-[20%_20%] z-0 opacity-30" />
                <h1 className="relative font-bold z-1">
                  Mentor
                </h1>
                <p className="relative z-1">
                  Ahli berpengalaman di bidangnya yang siap membimbingmu dengan pendekatan interaktif dan personal.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[1.25rem] space-y-2 overflow-hidden relative flex-1">
                <img src={bg3.src} alt="background" className="h-full w-full object-cover absolute top-0 left-0 object-[20%_20%] z-0 opacity-30" />
                <h1 className="font-bold relative z-1">
                  Ruang Diskusi
                </h1>
                <p className="relative z-1">
                  Tempat yang seru untuk bertukar ide, pengalaman, dan perspektif!
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white text-black p-10 rounded-[1.25rem] relative overflow-hidden">
            <img src={bg4.src} alt="background" className="h-full w-full object-cover absolute top-0 left-0 object-[20%_20%] z-0 opacity-30" />
            <p className="relative z-1">
              Innoventum adalah platform belajar interaktif yang menghubungkan mentor dan pembelajar untuk pengembangan skill dan wawasan secara fleksibel. </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services