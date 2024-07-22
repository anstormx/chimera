import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";
import { GetIpfsUrlFromPinata } from "../utils/url";
import marketplace from "../marketplace.json";
import getProvider from "../utils/getProvider";
// import { prisma } from "../utils/db";

const homeContext = createContext(undefined);

export const useHomeContext = () => {
  return useContext(homeContext);
};

export const HomeProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currAddress, updateCurrAddress] = useState("0x");

  const getAllNFTs = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const { provider, address } = await getProvider();
      updateCurrAddress(address);

      const contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        provider
      );
      const listedNFT = await contract.getMarketTokens();

      const cachedDataString = localStorage.getItem("nftData");
      const cachedData = cachedDataString ? JSON.parse(cachedDataString) : [];

      if (cachedData.length > listedNFT.length) {
        setData(JSON.parse(cachedData));
        setDataFetched(true);
        setLoading(false);
        return;
      }

      const items = await Promise.all(
        listedNFT.map(async (nft) => {
          let tokenURI = await contract.tokenURI(nft.tokenID);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          const price = ethers.utils.formatUnits(nft.price.toString(), "ether");
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
        })
      );

      const finalItems = items.filter((item) => item !== null);

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

      localStorage.setItem("nftData", JSON.stringify(items));
    } catch (error) {
      toast.error("Error fetching NFTs. Check console for more details.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currAddress !== "0x") {
      toast.info(`Connected with: ${currAddress}`);
    }
  }, [currAddress]);

  return (
    <homeContext.Provider value={{ data, dataFetched, loading, getAllNFTs }}>
      {children}
    </homeContext.Provider>
  );
};
