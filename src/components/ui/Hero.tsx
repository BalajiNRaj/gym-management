"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <section 
      className="min-h-screen flex flex-col justify-center items-center text-center p-20 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/hero-background.jpg')",
        color: "#bebebe",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 p-3 rounded-lg"
          style={{
            color: "#c0f8e9",
            backdropFilter: "blur(10px)",
          }}
        >
          Welcome to Our Fitness App
        </h1>
        
        <h5 
          className="text-xl mb-8 p-3 rounded-lg"
          style={{
            color: "#ded7d7",
            backdropFilter: "blur(5px)",
          }}
        >
          Achieve Your Fitness Goals with Ease
        </h5>
        
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
