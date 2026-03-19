"use client";

import Image from 'next/image';



const ImageSection = () => {

  return (

    <section className="relative bg-gray-200 h-[60vh] w-full mt-40 mb-24 overflow-hidden">

      {}

      <Image

        src="/images/general/image-section.png" 

        alt="Citizens benefiting from government schemes"

        fill

        className="object-cover"

        priority

      />

      

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>

      

      {}

      <div className="absolute inset-0 flex items-center justify-center text-center px-4">

        <div className="max-w-7xl">

          <h2 className="text-4xl max-w-3xl md:text-5xl font-bold text-white mb-6 leading-tight">

            Connecting You to Life Changing Government Benefits

          </h2>

          <p className="text-xl text-white/90">

            Simple access to schemes that empower farmers, students, entrepreneurs and more

          </p>

        </div>

      </div>

    </section>

  );

};



export default ImageSection;
 