import NFTTile from "./NFTcard";
import {useEffect} from "react";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useHomeContext } from "../context/homeContent";



export default function Marketplace() {
    const { data, dataFetched, loading, getAllNFTs } = useHomeContext();

    useEffect(() => {
        if (!dataFetched) {
            getAllNFTs();
        }
    }, [dataFetched, getAllNFTs]);

    return (
        <div className="flex flex-col place-items-center mt-20 min-h-screen">
            <div className="text-3xl font-bold text-white">
                Listed NFTs
            </div>
            {loading ? (
                <div className="text-white mt-10 text-xl">
                    <FontAwesomeIcon icon={faSpinner} spin className="mt-10" size="3x" />
                </div>
            ) : (
                <div>
                    {data.length > 0 ? (
                        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                spaceBetween={50}
                                slidesPerView={3}
                                navigation
                                speed={1000}
                                pagination={{ clickable: true }}
                                scrollbar={{ draggable: true }}   
                            >
                            {data.map((item, index) => (
                                <SwiperSlide>
                                    <NFTTile data={item} key={index} />                             
                                </SwiperSlide>
                            ))}
                            </Swiper>
                        </div>
                    ) : (
                        <div className="mt-10 text-white" style={{fontSize:'1.2rem'}}>No NFTs listed</div>
                    )}
                </div>
            )}
        </div>  
    );
}
