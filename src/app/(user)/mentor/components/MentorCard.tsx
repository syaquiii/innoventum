// components/mentor/MentorCard.tsx
import Image from "next/image";
import { Mentor } from "../hooks/useMentor";

interface MentorCardProps {
  mentor: Mentor;
  onViewDetails: (id: number) => void;
}

export const MentorCard = ({ mentor, onViewDetails }: MentorCardProps) => {
  const keahlianList = mentor.keahlian.split(",").map((k) => k.trim());

  return (
    <div className="flex flex-col w- h-full bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-lg p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1 left-1 text-5xl font-bold text-indigo-600/20 select-none ">
        {mentor.nama}
      </div>

      <div className="relative z-10 flex flex-col gap-6 h-full">
        {/* Profile Image */}
        <div className="">
          <div className="w-50 h-50 overflow-hidden rounded-full bg-gray-700 flex justify-center">
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
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold mb-3 line-clamp-1">{mentor.nama}</h2>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-3">
              {mentor.bio}
            </p>
          </div>
          <button
            onClick={() => onViewDetails(mentor.mentor_id)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-xs font-medium transition-colors"
          >
            Lihat Marketing Specialist
          </button>
        </div>
      </div>
    </div>
  );
};
