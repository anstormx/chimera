import { Link, useParams } from "react-router-dom";
import marketplace from "../marketplace.json";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils/url";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import getProvider from "../utils/getProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function NFTPage() {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [currAddress, updateCurrAddress] = useState("0x");
  const [loading, updateLoading] = useState(false);
  const tokenID = useParams().tokenID;

  const getNFTData = useCallback(async (tokenID) => {
    try {
      updateLoading(true);
      const { provider, address } = await getProvider();
      updateCurrAddress(address);
      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        provider
      );
      var tokenURI = await contract.tokenURI(tokenID);
      const listedToken = await contract.getListedToken(tokenID);
      tokenURI = GetIpfsUrlFromPinata(tokenURI);
      let meta = await axios.get(tokenURI);
      meta = meta.data;
      let item = {
        price: meta.price,
        tokenID: tokenID,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      updateData(item);
      updateDataFetched(true);
    } catch (err) {
      toast.error(
        "Error fetching NFT data. Please check console for more details"
      );
      console.log(err);
    } finally {
      updateLoading(false);
    }
  }, []);

  async function buyNFT(tokenID) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        if (err.code === 4001) {
          alert("Please connect with MetaMask to proceed");
          return;
        } else if (err.code === -32002) {
          alert(
            "Already processing request to connect accounts. Please confirm the request in your Metamask extension."
          );
          return;
        } else {
          alert(
            "Error connecting with MetaMask. Please check console for more details"
          );
          console.log(err);
          return;
        }
      }
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      toast.info("Buying the NFT... Please Wait");
      let transaction = await contract.executeTokenSale(tokenID, {
        value: salePrice,
      });
      await transaction.wait();
      toast.success("You successfully bought the NFT!");
    } catch (e) {
      toast.error("Error, please check console for more details");
      console.log(e);
    }
  }

  async function listNFT(tokenID) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        if (err.code === 4001) {
          toast.error("Please connect with MetaMask to proceed");
          return;
        } else if (err.code === -32002) {
          toast.warn(
            "Already processing request to connect accounts. Please confirm the request in your Metamask extension."
          );
          return;
        } else {
          toast.error(
            "Error connecting with MetaMask. Please check console for more details"
          );
          console.log(err);
          return;
        }
      }
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      toast.info("Updating the NFT... Please Wait");
      let transaction = await contract.updateListingStatus(tokenID);
      await transaction.wait();
      toast.success("You successfully updated the NFT!");
    } catch (e) {
      toast.error("Error, please check console for more details");
      console.log(e);
    }
  }

  useEffect(() => {
    if (!dataFetched) getNFTData(tokenID);
    if (typeof data.image == "string")
      data.image = GetIpfsUrlFromPinata(data.image);

    const handleAccountsChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  }, [data, dataFetched, tokenID, getNFTData]);

  return (
    <div className="flex py-[2%] min-h-screen flex-row w-full">
      {loading ? (
        <div className="flex justify-center w-full my-[10%]">
          <FontAwesomeIcon icon={faSpinner} spin size="4x" />
        </div>
      ) : (
        <div className="flex w-full flex-row h-[75vh] mx-[8%]">
          <img src={data.image} alt="nft" className="w-2/5 rounded-3xl" />
          <div
            className="text-lg ml-20 space-y-12 bg-gray-800 text-white rounded-3xl p-5 w-2/5"
            style={{ marginLeft: "20%" }}
          >
            <div className="mt-2">
              <div className="text-base font-semibold text-blue-400">
                <Link to="https://opensea.io/collection/boredapeyachtclub">
                  {data.description}
                </Link>
              </div>
              <div className=" text-3xl font-semibold mt-6"># {data.name}</div>
              <div className="text-base">Owned by: {data.seller}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Current price</div>
              <div className="text-3xl mt-2 font-bold">
                {data.price + " ETH"}
                <span className="text-sm text-gray-400 ml-4">
                  ${data.price * 4000}
                </span>
              </div>
            </div>
            <div>
              {currAddress !== data.owner && currAddress !== data.seller ? (
                <button
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-xl transition duration-200"
                  onClick={() => buyNFT(tokenID)}
                >
                  Buy this NFT
                </button>
              ) : (
                <div className="text-green-500 text-lg font-semibold">
                  You are the owner of this NFT
                  <br />
                  {marketplace.address === data.owner ? (
                    <button
                      className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-xl transition duration-200"
                      onClick={() => listNFT(tokenID)}
                    >
                      Unlist this NFT
                    </button>
                  ) : (
                    <button
                      className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-xl transition duration-200"
                      onClick={() => listNFT(tokenID)}
                    >
                      List this NFT
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
