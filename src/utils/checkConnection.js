import { toast } from "react-toastify"; // If you're using toast notifications

export const checkConnection = async (getData, setState) => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setState(true);
        getData();
      } else {
        setState(false);
      }
    } catch (error) {
      toast.error("Error checking connection, check console for more details.");
      console.log(error);
    }
  }
};
