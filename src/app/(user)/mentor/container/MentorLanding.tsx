import bg from "@/shared/assets/mentor/MentorHero.png"

const MentorLanding = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: `url(${bg.src})` }}
      >
      <div className="h-screen w-screen bg-linear-to-t from-dark to-dark/0">
        <div className="mycontainer flex items-center h-full text-white">
          <div>
            <h1 className="font-bold text-8xl">
              Cari Mentor
            </h1>
            <p className="text-lg w-[70%]">
              Butuh bimbingan langsung dari ahlinya? Temukan mentor terbaik di Innoventum yang siap membantumu mengembangkan ide, meningkatkan keterampilan, dan mencapai tujuanmu. Jelajahi berbagai bidang, pilih mentor sesuai kebutuhan, dan mulai perjalanan belajarmu hari ini!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorLanding