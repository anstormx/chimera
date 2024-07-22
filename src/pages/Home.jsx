import NFTTile from "./components/NFTcard";
import { useEffect } from "react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useHomeContext } from "../context/homeContext";
import { debounce } from "lodash";
import Hero from "./components/Hero";

export default function Home() {
  const { data, dataFetched, loading, getAllNFTs } = useHomeContext();
  const [delay, setDelay] = React.useState(0);

  const debounceGetAllNFTs = debounce(getAllNFTs, delay);

  useEffect(() => {
    if (!dataFetched) {
      debounceGetAllNFTs();
      setDelay(10000);
    }
  }, [dataFetched, debounceGetAllNFTs]);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-cover bg-center blur-sm z-[-1] bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')]"></div>
      <Hero />
      <div className="flex flex-col place-items-center">
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} spin className="my-32" size="3x" />
        ) : (
          <div className="mb-16">
            {data.length > 0 ? (
              <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                  spaceBetween={50}
                  slidesPerView={3}
                  navigation
                  speed={1000}
                  pagination={{ clickable: true }}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                >
                  {data.map((item, index) => (
                    <SwiperSlide key={index}>
                      <NFTTile data={item} key={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="mt-10 text-white text-xl">No NFTs listed</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
