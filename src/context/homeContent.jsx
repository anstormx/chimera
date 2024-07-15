import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";
import { GetIpfsUrlFromPinata } from "../utils/url";
import marketplace from "../marketplace.json";
// import { prisma } from "../utils/db";

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
   
            let provider = new ethers.providers.InfuraProvider(
                "sepolia",
                process.env.INFURA_PROJECT_ID
            );

            if (window.ethereum) {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if(chainId !== '0xaa36a7') {
                    toast.warn("You're viewing data from the Sepolia network, but your wallet is connected to mainnet");
                }
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                }
            }
            const contract = new ethers.Contract(marketplace.address, marketplace.abi, provider);
            const listedNFT = await contract.getMarketTokens();

            const cachedDataString = localStorage.getItem('nftData');
            const cachedData = cachedDataString ? JSON.parse(cachedDataString) : [];

            console.log(cachedData);
            console.log(listedNFT.length);
            if (cachedData.length > listedNFT.length) {
                setData(JSON.parse(cachedData));
                setDataFetched(true);
                setLoading(false);
                return;
            }

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
            
            const finalItems = items.filter(item => item !== null);

            // const response = await prisma.wallet.create({
            //     data: {
            //       salt: salt,
            //       signers: signers.map((s) => s.toLowerCase()), // Convert all signer addresses to lowercase for consistency
            //       isDeployed: false,
            //       address: walletAddress,
            //     },
            // });

            setData(finalItems);
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
