import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";
import { GetIpfsUrlFromPinata } from "../utils";
import marketplace from "../marketplace.json";

const homeContext = createContext(undefined);

export const useHomeContext = () => {
    return useContext(homeContext);
};

export const HomeProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(false);

    const getAllNFTs = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const cachedData = localStorage.getItem('nftData');
            if (cachedData) {
                setData(JSON.parse(cachedData));
                setDataFetched(true);
                setLoading(false);
                return;
            }
            const providerInfura = new ethers.providers.InfuraProvider(
                "sepolia",
                process.env.INFURA_PROJECT_ID
            );
            const contract = new ethers.Contract(marketplace.address, marketplace.abi, providerInfura);
            const listedNFT = await contract.getMarketTokens();
            const items = await Promise.all(listedNFT.map(async nft => {
                let tokenURI = await contract.tokenURI(nft.tokenID);
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
                };
                return item;
            }));
            setData(items.filter(item => item !== null));
            setDataFetched(true);

            localStorage.setItem('nftData', JSON.stringify(items));
        } catch (error) {
            toast.error("Error fetching NFTs. Check console for more details.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <homeContext.Provider value={{ data, dataFetched, loading, getAllNFTs }}>
            {children}
        </homeContext.Provider>
    );
};
