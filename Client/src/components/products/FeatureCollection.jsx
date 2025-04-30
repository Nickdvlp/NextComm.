import React from "react";
import { Link } from "react-router-dom";
import features from "../../assets/features-2.jpg";

const FeatureCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-lime-200 rounded-3xl">
        {/* Left Corner */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Your Style, Your Store
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Apparel made for your everyday life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Elevate your wardrobe with versatile pieces that combine comfort,
            quality, and timeless style.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 "
          >
            Shop now
          </Link>
        </div>
        {/* Right Corner */}
        <div className="lg:w-1/2">
          <img
            src={features}
            alt="features"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureCollection;
