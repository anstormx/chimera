import { ethers } from "ethers";
import { toast } from "react-toastify";

const getProvider = async () => {
  let provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_PROJECT_ID
  );
  let address = "0x";
  if (window.ethereum) {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (chainId !== "0xaa36a7") {
      toast.warn(
        "You're viewing data from the Sepolia network, but your wallet is connected to mainnet"
      );
    }
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length > 0) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      address = await signer.getAddress();
    } else {
      toast.info("Please connect with MetaMask to interact with the NFT");
    }
  }
  return {
    provider,
    address,
  };
};

export default getProvider;
