import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
  const handleExplore = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  return (
    <div className='w-full'>
      <div className='flex justify-center flex-wrap items-center py-6'>
        <div className='w-1/2'>
          <div className='relative text-white text-[56px] font-semibold'>
            Discover, collect, and sell extraordinary NFTs
          </div>
          <div className='flex mt-10'>
            <button 
              className='text-lg font-semibold px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl mr-5 transition duration-200'
              onClick={handleExplore}
            >
              Explore
            </button>
            <Link
              className='text-lg font-semibold px-10 py-4 bg-gray-800 rounded-xl mr-5 hover:bg-gray-700 transition duration-200'
              to="/listing"
            >
              Create
            </Link>
          </div>
        </div>
        <Link to="https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/2324922113504035910649522729980423429926362207300810036887725141691069366277">
        <div className='rounded-xl overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl group'>
          <img
            className="w-full h-auto"
            src="https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s550"
            alt=""
          />
          <div className='flex-col justify-center text-3xl font-semibold h-24 bg-gray-800 group-hover:bg-gray-700 p-6 flex items-center text-white transition duration-300 ease-in-out'>
            Jolly
          </div>
        </div>
      </Link>
      </div>
    </div>
  )
}

export default Hero