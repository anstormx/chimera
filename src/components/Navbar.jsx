import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
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

  const handleConnectWebsite = useCallback(() => {
    connectWebsite(setLoading, toggleConnect);
  }, []);

  useEffect(() => {
    checkConnection(handleConnectWebsite, toggleConnect);

    const handleAccountsChanged = () => {
      checkConnection(handleConnectWebsite, toggleConnect);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, [handleConnectWebsite]);

  return (
    <div className="w-screen">
      <ul className='flex justify-between py-3 bg-transparent text-white'>
        <li className='flex items-start ml-6'>  
          <img src={logo} alt="logo" className="inline-block w-12 h-12 rounded-full" />
          <div className='inline-block font-bold text-4xl ml-3'>
            chimera
          </div>    
        </li>
        <li className='w-2/6 mr-6'>
          <ul className='flex justify-evenly font-semibold text-xl items-end'>
            {location.pathname === "/" ? 
            <li className='border-b-2 p-3'>
              <Link to="/">Home</Link>
            </li>
            :
            <li className='hover:border-b-2 p-3'>
              <Link to="/">Home</Link>
            </li>              
            }
            {location.pathname === "/listing" ? 
            <li className='border-b-2 p-3'>
              <Link to="/listing">Listing</Link>
            </li>
            :
            <li className='hover:border-b-2 p-3'>
              <Link to="/listing">Listing</Link>
            </li>              
            }              
            {location.pathname === "/profile" ? 
            <li className='border-b-2 p-3'>
              <Link to="/profile">Profile</Link>
            </li>
            :
            <li className='hover:border-b-2 p-3'>
              <Link to="/profile">Profile</Link>
            </li>              
            }  
            <li>
              {connected ?
                <button 
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-2xl" 
                  disabled={true}
                > 
                  Connected
                </button>
              : 
                <button 
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-2xl" 
                  onClick={handleConnectWebsite} 
                  disabled={loading}
                >
                  {loading ? 
                    <div>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-3"/> 
                      Connecting
                    </div>: "Connect"
                  }
                </button>
              }
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;