import Navbar from "./Navbar";
import marketplace from "../marketplace.json";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "../utils";
import { useState, useEffect, useCallback } from "react";
import NFTTile from "./NFTcard";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");
    const [loading, setLoading] = useState(false);


    const getNFTData = useCallback(async () => {
        setLoading(true);
        let sumPrice = 0;
        if (typeof window.ethereum === 'undefined') {
            return;
        } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = provider.getSigner();
                const addr = await signer.getAddress();
                let contract = new ethers.Contract(marketplace.address, marketplace.abi, signer)
                let mynft = await contract.getMyNFTs()

                const items = await Promise.all(mynft.map(async nft => {
                    try {
                        var tokenURI = await contract.tokenURI(nft.tokenID);
                        tokenURI = GetIpfsUrlFromPinata(tokenURI);
                        let meta = await axios.get(tokenURI);
                        meta = meta.data;

                        let price = ethers.utils.formatUnits(nft.price.toString(), 'ether');
                        let item = {
                            price: price,
                            tokenId: nft.tokenID.toNumber(),
                            seller: nft.seller,
                            owner: nft.owner,
                            image: meta.image,
                            name: meta.name,
                            description: meta.description,
                        }
                        sumPrice += Number(price);
                        return item;
                    } catch (error) {
                        toast.error("Error fetching token metadata:", error);
                        return null;
                    }
                }))
                updateData(items.filter(item => item !== null));
                updateFetched(true);
                updateAddress(addr);
                updateTotalPrice(sumPrice.toFixed(3));
            } catch(err) {
                if (err.code === 4001) {
                    toast.error('Please connect your Metamask wallet.');
                } else if (err.code === -32002) {
                    toast.warn("Already processing request to connect accounts. Please confirm the request in your Metamask extension.");
                } else {
                    toast.error("Error loading Profile data.");
                    console.log(err);
                }
            } finally {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!dataFetched) {
            getNFTData();
        }
    }, [dataFetched, getNFTData]);

    return (
        <div className="profileClass min-h-screen flex flex-col">
            <Navbar />
            <div className="flex text-center flex-col mt-20 text-white">
                <div className="mb-5">
                    <h2 className="font-bold text-lg">Wallet Address: {address}</h2>  
                </div>
            </div>
            <div className="flex flex-row text-center justify-center md:text-2xl text-white" style={{fontSize: '1.2rem'}}>
                    <div>
                        <h2 className="font-bold">Total NFTs: {data.length}</h2>
                    </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value: {totalPrice} ETH</h2>
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-5 text-white">
                <h2 className="font-bold text-2xl">Your NFTs</h2>
                <div className="flex justify-center flex-wrap max-w-screen-2xl overflow-auto">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index} />;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {loading ? (
                        <div className="text-white mt-10 text-xl">
                            <FontAwesomeIcon icon={faSpinner} spin className="mt-10" size="3x" />
                        </div>
                    ) : (
                        <div>
                            {data.length === 0 ? "No NFT data to display":""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};