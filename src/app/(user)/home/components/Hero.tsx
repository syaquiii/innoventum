import bg from "@/shared/assets/home/unsplash_1emWndlDHs0.png";

const Hero = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="bg-linear-to-t from-dark to-transparent bg-top h-1/4 absolute z-1 left-0 right-0 bottom-0"></div>
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
