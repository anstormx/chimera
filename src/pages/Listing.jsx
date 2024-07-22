import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/pinata";
import marketplace from "../marketplace.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export default function Listing() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState(null);

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  async function OnChangeFile(event) {
    var file = event.target.files[0];
    try {
      disableButton();
      toast.info("Uploading image to IPFS...");
      const response = await uploadFileToIPFS(file);
      if (response.status === true) {
        enableButton();
        toast.success("Image uploaded successfully!");
        setFileURL(response.pinataURL);
      }
    } catch (error) {
      toast.error(
        "Error uploading image to IPFS, check console for more details."
      );
      console.log("Error during file upload", error);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams;
    if (!name || !description || !price || !fileURL) {
      toast.error("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name: name,
      description: description,
      price: price,
      image: fileURL,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.status === true) {
        return response.pinataURL;
      }
    } catch (error) {
      toast.error(
        "Error uploading JSON metadata, check console for more details."
      );
      console.log("Error uploading JSON metadata:", error);
    }
  }

  async function listNFT(event) {
    event.preventDefault();
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
      if (typeof window.ethereum === "undefined") {
        toast.error(
          "Please install MetaMask to interact with this marketplace!"
        );
        return;
      }

      // Check if the network is Sepolia
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        try {
          toast.warn(
            "Incorrect network! Switch your metamask network to Sepolia"
          );
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (error) {
          if (error.code === 4001) {
            toast.error("Please connect to MetaMask.");
            return;
          } else {
            toast.error("Failed to switch network. Please switch manually.");
            return;
          }
        }
      }

      // Upload NFT to blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      disableButton();
      toast.info("Uploading NFT, please wait!");

      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.utils.parseUnits(formParams.price, "ether");
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      toast.success("NFT listed successfully!");
      enableButton();
      updateFormParams({ name: "", description: "", price: "" });
    } catch (error) {
      enableButton();
      toast.error("Error listing NFT, check console for more details.");
      console.log("Upload error", error);
    }
  }

  return (
    <div
      className="flex flex-col items-center px-10 py-6 min-h-screen"
      id="nftForm"
    >
      <form className="bg-transparent text-white">
        <h3 className="text-center font-bold mb-6 text-3xl">List Your NFT</h3>
        <div className="mb-4">
          <label className="block text-lg mb-2 font-semibold" htmlFor="name">
            NFT Name
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            onChange={(e) =>
              updateFormParams({ ...formParams, name: e.target.value })
            }
            value={formParams.name}
          ></input>
        </div>
        <div className="mb-4">
          <label
            className="block text-lg mb-2 font-semibold"
            htmlFor="description"
          >
            NFT Description
          </label>
          <textarea
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            cols="40"
            rows="4"
            id="description"
            type="text"
            value={formParams.description}
            onChange={(e) =>
              updateFormParams({ ...formParams, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2 font-semibold" htmlFor="price">
            Price (in ETH)
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Min 0.025 ETH"
            step="0.01"
            value={formParams.price}
            onChange={(e) =>
              updateFormParams({ ...formParams, price: e.target.value })
            }
          ></input>
        </div>
        <div>
          <label className="block text-lg mb-2 font-semibold" htmlFor="image">
            Upload Image (&lt;500 KB)
          </label>
          <input type={"file"} onChange={OnChangeFile}></input>
        </div>
        <button
          onClick={listNFT}
          className="font-semibold mt-10 text-lg w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-2 shadow-lg transition duration-200"
          id="list-button"
        >
          List
        </button>
      </form>
    </div>
  );
}
