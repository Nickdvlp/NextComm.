import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative">
      <img
        src="https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg"
        alt="hero-image"
        className="w-full h-[400px] md:h-[600px] lg:h-[600px] object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center ">
        <div className="text-center text-white p-6 py-2">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-6">
            Graceful <br /> Look
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our best quality outfits with fast worldwide shipping
          </p>
          <Link
            to="#"
            className="bg-white text-gray-950 px-6 py-2 rounded-md text-lg"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
