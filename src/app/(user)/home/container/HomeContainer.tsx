import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import CallToAction from "../components/CallToAction";


const HomeContainer = () => {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <CallToAction />
    </main>
  );
};

export default HomeContainer;
