import NFTTile from "./components/NFTcard";
import {useEffect} from "react";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useHomeContext } from "../context/homeContent";
import { debounce } from "lodash";


export default function Marketplace() {
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
        <div className="flex flex-col place-items-center py-6 px-10 min-h-screen">
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
                                <SwiperSlide key={index}>
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
