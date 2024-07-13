import NFTTile from "./NFTcard";
import marketplace from "../marketplace.json";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


export default function Marketplace() {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [loading, setLoading] = useState(false);


    const getAllNFTs = useCallback(async () => {
        setLoading(true);
        try {
            const providerInfura = new ethers.providers.InfuraProvider(
                "sepolia",
                process.env.INFURA_PROJECT_ID
            );
            const contract = new ethers.Contract(marketplace.address, marketplace.abi, providerInfura);
            const listedNFT = await contract.getMarketTokens();
            const items = await Promise.all(listedNFT.map(async nft => {
                try {
                    var tokenURI = await contract.tokenURI(nft.tokenID);
                    tokenURI = GetIpfsUrlFromPinata(tokenURI);
                    let meta = await axios.get(tokenURI);
                    meta = meta.data;

                    const price = ethers.utils.formatUnits(nft.price.toString(), 'ether');
                    let item = {
                        price: price,
                        tokenID: nft.tokenID.toNumber(),
                        seller: nft.seller,
                        owner: nft.owner,
                        image: meta.image,
                        name: meta.name,
                        description: meta.description,
                    }
                    return item;
                } catch (error) {
                    toast.error("Error fetching token metadata:", error);
                    return null;
                }
            }));
            updateData(items.filter(item => item !== null));
            updateFetched(true);
        } catch (error) {
            toast.error("Error fetching NFTs. Check console for more details.");
            console.log(error);
        } finally {
            setLoading(false);
        }         
    }, []);

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
