import bg from "@/shared/assets/home/unsplash_1emWndlDHs0.png";

const HomeContainer = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      {/* Konten di atas background */}
      <div className="flex flex-col items-center justify-center h-full bg-black/40 text-white">
        <h1 className="text-5xl font-bold">Welcome to Innoventum</h1>
        <p className="text-lg mt-3">Build something extraordinary</p>
      </div>
    </div>
  );
};

export default HomeContainer;
