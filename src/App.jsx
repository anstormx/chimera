import Home from './components/Home';
import Profile from './components/Profile';
import Listing from './components/Listing';
import NFTPage from './components/NFTpage';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ThreeScene from './components/Threescene';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/bundle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HomeProvider } from './context/homeContent';


function App() {
  return (
    <div className="relative min-h-screen">
      <ThreeScene />
      <div className="overflow-x-hidden overflow-y-hidden">
      <HomeProvider>
        <Router>
          <Navbar />
          <Routes>
              <Route path="/" element={<Home />}/>
            <Route path="/nftpage/:tokenID" element={<NFTPage />}/>        
            <Route path="/profile" element={<Profile />}/>
            <Route path="/listing" element={<Listing />}/>             
          </Routes>
          <Footer />
        </Router>
      </HomeProvider>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop={false}
        hideProgressBar={true}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
        stacked 
        transition={Flip}
      />
    </div>
  );
}

export default App;