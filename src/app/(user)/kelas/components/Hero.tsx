import HeroBG from "@/shared/assets/kelas/kelas-bg.png";
const Hero = () => {
  return (
    <div
      className="w-full min-h-screen bg-gray-500 flex items-center bg-center bg-cover"
      style={{ backgroundImage: `url(${HeroBG.src || HeroBG})` }}
    >
      <div className="mycontainer space-y-4">
        <h2 className="text-6xl font-bold text-white">Cari Kelas</h2>
        <p className="w-3/4 text-lg text-white">
          Temukan kelas terbaik untuk mengasah keterampilan dan mengembangkan
          ide-ide inovatifmu! Pilih kelas sesuai minatmu, belajar langsung dari
          mentor ahli, dan wujudkan potensimu bersama Innova Space!
        </p>
      </div>
    </div>
  );
};

export default Hero;
