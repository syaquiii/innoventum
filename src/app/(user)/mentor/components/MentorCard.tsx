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
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-lg p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 text-8xl font-bold text-indigo-800/20 select-none">
        ONBOARD MENTOR START
      </div>

      <div className="relative z-10 flex gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
            {mentor.foto ? (
              <img
                src={mentor.foto}
                alt={mentor.nama}
                width={128}
                height={128}
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
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-3 line-clamp-1">{mentor.nama}</h2>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-3">
            {mentor.bio}
          </p>
          <button
            onClick={() => onViewDetails(mentor.mentor_id)}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Lihat Marketing Specialist
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
            <span>🎓</span> Keahlian
          </h3>
          <ul className="space-y-1 text-sm">
            {keahlianList.map((skill, idx) => (
              <li key={idx} className="text-gray-300">
                • {skill}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
            <span>🎯</span> Topik yang Diajarkan
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Strategi Digital Marketing</li>
            <li>• Cara Efektif Mengembangkan Brand</li>
            <li>• Optimasi SEO & SEM</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
