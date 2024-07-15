import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { checkConnection } from '../../utils/checkConnection';
import { connectWebsite } from '../../utils/connectWallet';


function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className='bg-transparent w-screen px-16 py-[0.8rem] flex text-white'> 
      <Link to="/">
        <div className="flex items-center cursor-pointer">
          <img src={logo} alt="logo" className="rounded-full" width={40} height={40}/>
          <div className='ml-[0.8rem] font-bold text-3xl'>
            chimera
          </div>    
        </div>
      </Link>
      <div className='flex items-center text-lg'>
        <div data-orientation="vertical" role="none" class="h-full w-[1.5px] mx-6 bg-white/20">
        </div>
        <div className='mr-4 font-bold hover:text-[#c8cacd] cursor-pointer transition duration-200'> 
          <Link to="/profile">Profile</Link>
        </div>
        <div className='mx-4 font-bold hover:text-[#c8cacd] cursor-pointer transition duration-200'> 
          <Link to="/listing">Listing</Link>
        </div>
      </div>

      {/* Search bar */}
      <div className='flex mx-[10%] w-[31%] px-4 items-center rounded-xl bg-[#36384A] hover:bg-[#4c505c] transition duration-200 bg-opacity-90'>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 text-[#8a939b]"/>        
        {/* <div className='text-[#8a939b] mx-3 font-bold text-lg'>
          <AiOutlineSearch />
        </div> */}
        <input className='h-12 w-full border-0 bg-transparent px-2 text-[#e6e8eb] placeholder:text-[#8a939b] placeholder:font-semibold outline-0' 
          placeholder="Search"/>
      </div>
      <div className='flex items-center ml-auto'>
        {connected ?
          <button 
            className="bg-green-500 hover:bg-green-700 py-2 px-4 rounded-xl h-12 font-semibold transition duration-200" 
            disabled={true}
          > 
            Connected
          </button>
        : 
          <button 
            className="enableEthereumButton bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-xl h-12 font-semibold transition duration-200" 
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
      </div>
    </div>
  );
}

export default Navbar;