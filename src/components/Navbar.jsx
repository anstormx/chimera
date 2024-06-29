import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const updateButton = useCallback(() => {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    if (ethereumButton) {
      ethereumButton.textContent = "Connected";
      ethereumButton.classList.remove("hover:bg-blue-70");
      ethereumButton.classList.remove("bg-blue-500");
      ethereumButton.classList.add("hover:bg-green-70");
      ethereumButton.classList.add("bg-green-500");
    }
  }, []);

  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        toggleConnect(true);
        updateButton();
      }
    }
  }, [updateButton]);

  async function connectWebsite() {
    setLoading(true);
    
    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined') {
      toast.error('Metamask not installed! Please install Metamask to continue');
      setLoading(false);
      return;
    }
    
    // Check if Metamask network is Sepolia
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0xaa36a7') {
      try {
        toast.warn('Incorrect network! Switch your metamask network to Sepolia');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (error) {
        if (error.code === 4001) {
          toast.error('Please connect to MetaMask.');  
          setLoading(false);  
          return;     
        }
        else {
          toast.error('Failed to switch network. Please switch manually.'); 
          setLoading(false);
          return;    
        }
      }
    } 

    try {
      // Request user accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          updateButton();
          toggleConnect(true); // Update the connected state
          window.location.replace(location.pathname);
        });
    } catch (err) {
      if (err.code === -32002) {
        toast.warn('Already processing request to connect accounts. Please confirm the request in your Metamask extension.');
        setLoading(false);
        return;
      } 
      else if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (error) {
          toast.error('Failed to add Sepolia network to Metamask. Please add manually.');
          setLoading(false);
          return;
        }
      } else if (err.code === 4001) {
        toast.error('Please connect your Metamask wallet.'); // User rejected the connection request
        setLoading(false); 
        return;      
      } else {
        toast.error('An error occurred while connecting to MetaMask. Please try again.');
        setLoading(false); 
        return;      
      }
    } 
  }

  useEffect(() => {
    checkConnection();
    const handleAccountsChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [checkConnection]);

  return (
    <div>
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white'>
          <li className='flex items-end ml-12 pb-2'>  
            <img src={logo} alt="logo" className="inline-block w-11 h-11 rounded-full " />
            <div className='inline-block font-bold text-3xl ml-3 mb-1'>
              CHIMERA
            </div>    
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-xl'>
              {location.pathname === "/" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/">Home</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/">Home</Link>
              </li>              
              }
              {location.pathname === "/listing" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/listing">List NFT</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/listing">List NFT</Link>
              </li>              
              }              
              {location.pathname === "/profile" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>              
              }  
              <li>
                <button 
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-3xl text-lg" 
                  onClick={connectWebsite} 
                  disabled={loading}
                >
                  {loading ? <div><FontAwesomeIcon icon={faSpinner} spin className="mr-3" /> Loading</div>: (connected ? "Connected" : "Connect Wallet")}
                </button>              
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;