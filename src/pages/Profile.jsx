import marketplace from "../marketplace.json";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "../utils/url";
import { useState, useEffect, useCallback } from "react";
import NFTTile from "./components/NFTcard";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { checkConnection } from "../utils/checkConnection";

export default function Profile() {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnection] = useState(false);

  const getNFTData = useCallback(async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      let mynft = await contract.getMyNFTs();

      const items = await Promise.all(
        mynft.map(async (nft) => {
          try {
            var tokenURI = await contract.tokenURI(nft.tokenID);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(nft.price.toString(), "ether");
            let item = {
              price: price,
              tokenId: nft.tokenID.toNumber(),
              seller: nft.seller,
              owner: nft.owner,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };
            return item;
          } catch (error) {
            toast.error("Error fetching token metadata:", error);
            return null;
          }
        })
      );
      updateData(items.filter((item) => item !== null));
    } catch (err) {
      if (err.code === 4001) {
        toast.error("Please connect your Metamask wallet.");
      } else if (err.code === -32002) {
        toast.warn(
          "Already processing request to connect accounts. Please confirm the request in your Metamask extension."
        );
      } else {
        toast.error("Error loading Profile data.");
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection(getNFTData, setConnection);

    const handleAccountsChanged = () => {
      checkConnection(getNFTData, setConnection);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  }, [getNFTData]);

  return (
    <div className="min-h-screen flex flex-col flex-grow px-[8%] py-[2%]">
      {connected ? (
        <div>
          <div className="text-center text-white">
            <h2 className="font-bold text-3xl mb-4">Your NFTs</h2>
            <div>
              {loading ? (
                <div className="mt-14">
                  <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>
              ) : (
                <div>
                  {data.length === 0 ? (
                    "No NFT data to display"
                  ) : (
                    <div className="flex justify-center overflow-y-auto">
                      <div className="flex flex-wrap justify-start max-w-screen-2xl w-full px-4">
                        {data.map((value, index) => {
                          return <NFTTile data={value} key={index} />;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white font-bold text-2xl mt-16 ml-5">
          <h2>Please connect your wallet</h2>
        </div>
      )}
    </div>
  );
}
