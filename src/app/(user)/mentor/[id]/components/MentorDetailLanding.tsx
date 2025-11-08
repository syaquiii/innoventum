import bg from "@/shared/assets/mentor/Office.jpg";
import { Mentor } from "../../hooks/useMentor";

interface MentorDetailLandingProps {
  mentor: Mentor;
}

export function MentorDetailLanding({
  mentor,
}: MentorDetailLandingProps) {
  const keahlianList = mentor.keahlian.split(",").map((k) => k.trim());

  return (
    <div 
    className="h-screen w-full bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="z-0 absolute inset-0 bg-linear-to-t from-dark to-dark/20 h-screen" />
      <div className="relative z-1 mycontainer flex items-center h-full text-white gap-6">
        <div className="w-98 h-98 overflow-hidden rounded-full bg-gray-700 flex justify-center">
            {mentor.foto ? (
              <img
                src={mentor.foto}
                alt={mentor.nama}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👤
              </div>
            )}
        </div>
        <div className="w-[50%] space-y-4">
          <h1 className="text-5xl font-bold">
            {mentor.nama}
          </h1>
          <p className="text-lg">
            {mentor.bio}
          </p>
          <div className="flex flex-wrap gap-2">
            {keahlianList.map((keahlian, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-normal text-light rounded-2xl border border-blue-600 text-2xl font-medium"
              >
                {keahlian}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
}