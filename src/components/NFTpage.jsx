import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import marketplace from "../marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export default function NFTPage () {
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [currAddress, updateCurrAddress] = useState("0x");

    async function getNFTData(tokenID) {
        if (typeof window.ethereum === 'undefined') {
            return;
        }else{
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = provider.getSigner();
                const addr = await signer.getAddress();
                let contract = new ethers.Contract(marketplace.address, marketplace.abi, signer)
                var tokenURI = await contract.tokenURI(tokenID);
                const listedToken = await contract.getListedToken(tokenID);
                tokenURI = GetIpfsUrlFromPinata(tokenURI);
                let meta = await axios.get(tokenURI);
                meta = meta.data;
                console.log(listedToken);

                let item = {
                    price: meta.price,
                    tokenID: tokenID,
                    seller: listedToken.seller,
                    owner: listedToken.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                }
                updateData(item);
                updateDataFetched(true);
                updateCurrAddress(addr);
            } catch(err) {
                return;
            }
        }
    }

    async function buyNFT(tokenID) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch(err) {
                if (err.code === 4001) {
                    alert('Please connect with MetaMask to proceed');
                    return;
                } else if (err.code === -32002) {
                    alert("Already processing request to connect accounts. Please confirm the request in your Metamask extension.");
                    return;
                }  else {
                    alert('Error connecting with MetaMask. Please check console for more details');
                    console.log(err);
                    return;
                }
            }
            const signer = provider.getSigner();
            let contract = new ethers.Contract(marketplace.address, marketplace.abi, signer);
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')
            toast.info("Buying the NFT... Please Wait")
            let transaction = await contract.executeTokenSale(tokenID, {value:salePrice});
            await transaction.wait();
            toast.success('You successfully bought the NFT!');
        }
        catch(e) {
            toast.error("Error, please check console for more details");
            console.log(e);
        }
    }

    async function listNFT(tokenID) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch(err) {
                if (err.code === 4001) {
                    toast.error('Please connect with MetaMask to proceed');
                    return;
                } else if (err.code === -32002) {
                    toast.warn("Already processing request to connect accounts. Please confirm the request in your Metamask extension.");
                    return;
                }  else {
                    toast.error('Error connecting with MetaMask. Please check console for more details');
                    console.log(err);
                    return;
                }
            }
            const signer = provider.getSigner();
            let contract = new ethers.Contract(marketplace.address, marketplace.abi, signer);
            toast.info("Updating the NFT... Please Wait")
            let transaction = await contract.updateListingStatus(tokenID);
            await transaction.wait();
            toast.success('You successfully updated the NFT!');
        }
        catch(e) {
            toast.error("Error, please check console for more details");
            console.log(e);
        }
    }


    const params = useParams();
    const tokenID = params.tokenID;
    if(!dataFetched)
        getNFTData(tokenID);
    if(typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

    return(
        <div style={{"min-height":"100vh"}}>
            <Navbar />
            <div className="flex ml-20 mt-20" style={{margin:"20px 130px"}}>
                <img src={data.image} alt="nft" className="w-2/5 rounded-3xl h-[650px] p-1 border-purple-900 border-4"/>
                <div className="text-lg ml-20 space-y-12 bg-purple-900 bg-opacity-80 text-white shadow-2xl rounded-3xl p-5 w-2/5" style={{marginLeft:'20%'}}>
                    <div className="mt-7">
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: {data.price + " ETH"}
                    </div>
                    <div>
                        Owner: {data.owner}
                    </div>
                    <div>
                        Seller: {data.seller}
                    </div>
                    <div>
                        { currAddress !== data.owner && currAddress !== data.seller ?
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-xl font-bold" onClick={() => buyNFT(tokenID)}>
                                Buy this NFT
                            </button>
                            : <div className="text-green-600 text-xl font-bold">
                                You are the owner of this NFT
                                { marketplace.address === data.owner ? 
                                    <div className="mt-12">
                                        This NFT is listed for sale by you
                                        <br></br>
                                        <button className="mt-12 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-xl font-bold" onClick={() => listNFT(tokenID)}>
                                            Unlist this NFT
                                        </button>
                                    </div> : 
                                    <div className="mt-12">
                                        This NFT is not listed for sale
                                    <br></br>
                                    <button className="mt-12 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-xl font-bold" onClick={() => listNFT(tokenID)}>
                                        List this NFT
                                    </button>
                                    </div>
                                }
                            </div>
                        }      
                    </div>
                </div>
            </div>
        </div>
    )
}