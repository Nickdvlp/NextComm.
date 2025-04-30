import React from "react";

import { CiCreditCard1 } from "react-icons/ci";
import { FiLock } from "react-icons/fi";
import { TbTruckReturn } from "react-icons/tb";

const FeaturedSection = () => {
  return (
    <section className=" py-14 grid mx-auto container gap-8  px-4 md:grid-cols-3 place-items-center text-center mb-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <FiLock className="text-xl mb-1" />
        <h3 className=" md:text-xl ">Free international shipping</h3>
        <p className="text-sm text-gray-500">On all orders over $100,00</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <TbTruckReturn className="text-xl mb-1" />
        <h3 className="md:text-xl ">45 days return</h3>
        <p className="text-sm text-gray-500">Money back guarantee</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <CiCreditCard1 className="text-xl mb-1" />
        <h3 className="md:text-xl">secure checkout</h3>
        <p className="text-sm text-gray-500">100% secured checkout process</p>
      </div>
    </section>
  );
};

export default FeaturedSection;
