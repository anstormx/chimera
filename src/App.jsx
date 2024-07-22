import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import NFTPage from "./pages/NFTpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ThreeScene from './pages/components/Threescene';
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/bundle";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { HomeProvider } from "./context/homeContext";
import Collection from "./pages/Collection";

function App() {
  return (
    <div className="relative min-h-screen bg-black bg-opacity-90">
      {/* <ThreeScene /> */}
      <div className="overflow-x-hidden">
        <HomeProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nftpage/:tokenID" element={<NFTPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/listing" element={<Listing />} />
              <Route path="/collection" element={<Collection />} />
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
