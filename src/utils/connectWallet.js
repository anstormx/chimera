import { toast } from "react-toastify";

export const connectWebsite = async (setLoading, toggleConnect) => {
  try {
    setLoading(true);

    if (typeof window.ethereum === "undefined") {
      toast.error(
        "MetaMask is not installed. Please install MetaMask to connect"
      );
      setLoading(false);
      return;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0xaa36a7") {
      toast.warn("Incorrect network! Switch your metamask network to Sepolia");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    }

    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        toggleConnect(true);
      });
  } catch (err) {
    handleConnectError(err, setLoading);
  } finally {
    setLoading(false);
  }
};

const handleConnectError = (err, setLoading) => {
  if (err.code === -32002) {
    toast.warn(
      "Already processing request to connect accounts. Please confirm the request in your Metamask extension."
    );
  } else if (err.code === 4902) {
    addSepoliaNetwork();
    toast.warn("Please add Sepolia network to Metamask.");
  } else if (err.code === 4001) {
    toast.error("Please connect your Metamask wallet.");
  } else {
    toast.error(
      "An error occurred while connecting to MetaMask. Please try again."
    );
  }
  setLoading(false);
};

const addSepoliaNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xaa36a7",
          chainName: "Sepolia Test Network",
          nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.sepolia.org/"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ],
    });
  } catch (error) {
    toast.error(
      "Failed to add Sepolia network to Metamask. Please add manually."
    );
  }
};
