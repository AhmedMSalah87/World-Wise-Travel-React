import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <main className="py-6 px-12 bg-[linear-gradient(#242a2ecc,#242a2ecc),url(./assets/bg.jpg)] h-[calc(100vh-3.25rem)] bg-cover bg-center m-6">
      <NavBar />
      <section className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-5xl leading-[1.3] text-foreground font-bold">
            You travel the world. <br />
            WorldWise keeps track of your adventures.
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-6 font-semibold">
            A world map that tracks your footsteps into every city you can think
            of. Never forget your wonderful experiences, and show your friends
            how you have wandered the world.
          </h2>
          <Button asChild className="font-bold" size="lg">
            <Link to="signup" className="text-[1rem] tracking-wide">
              START TRACKING NOW
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
