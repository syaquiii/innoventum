import bg from "@/shared/assets/home/unsplash_1emWndlDHs0.png";

const Hero = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="flex flex-col items-center justify-center h-full bg-black/40 text-white font-poppins">
        <div className="flex flex-col">
          <h1 className="text-8xl font-bold">Innoventum</h1>
          <p className="text-large font-semibold">Find your innovation</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
