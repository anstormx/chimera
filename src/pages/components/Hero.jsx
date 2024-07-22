import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const handleExplore = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-center flex-wrap items-center py-[2%] space-x-20">
        <div className="w-1/2">
          <div className="relative text-white text-[3.6rem] font-semibold">
            Discover, collect, and sell extraordinary NFTs
          </div>
          <div className="flex mt-10 text-lg font-semibold">
            <button
              className="px-[5%] py-[2%] bg-blue-600 hover:bg-blue-500 hover:shadow-2xl rounded-xl mr-5 transition duration-200"
              onClick={handleExplore}
            >
              Explore
            </button>
            <Link
              className="px-[5%] py-[2%] bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-200 hover:shadow-2xl"
              to="/listing"
            >
              Create
            </Link>
          </div>
        </div>
        <Link to="https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/2324922113504035910649522729980423429926362207300810036887725141691069366277">
          <div className="h-[85vh] overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl group">
            <img
              className="w-full object-cover rounded-t-3xl h-[80%]"
              src="https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s550"
              alt=""
            />
            <div className="flex-col justify-center rounded-b-3xl text-4xl font-semibold bg-gray-800 group-hover:bg-gray-700 p-[8%] flex items-center text-white transition duration-300 ease-in-out">
              Jolly
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
