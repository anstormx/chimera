import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { checkConnection } from '../utils/checkConnection';
import { connectWebsite } from '../utils/connectWallet';


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

  const handleConnectWebsite = () => {
    connectWebsite(setLoading, updateButton, toggleConnect, location);
  };

  useEffect(() => {
    checkConnection(updateButton, toggleConnect);

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
  }, [updateButton]);

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
                  onClick={handleConnectWebsite} 
                  disabled={loading || connected}
                >
                  {loading ? <div><FontAwesomeIcon icon={faSpinner} spin className="mr-3" /> Loading</div>: (connected ? "Connected" : "Connect")}
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