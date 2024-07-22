import { Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../../utils/url";

function NFTTile({ data }) {
  var newTo;
  if (data.tokenID) {
    newTo = {
      pathname: "/nftPage/" + data.tokenID,
    };
  } else {
    newTo = {
      pathname: "/nftPage/" + data.tokenId,
    };
  }

  const IPFSUrl = GetIpfsUrlFromPinata(data.image);

  return (
    <Link to={newTo} className="block ml-[3.2rem] my-10">
      <div className="group flex flex-col items-center rounded-xl w-48 md:w-72 overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700">
        <div className="relative w-full">
          <img
            src={IPFSUrl}
            alt="nftimage"
            className="w-72 h-80 object-cover rounded-2xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white p-3 transition duration-300 ease-in-out group-hover:bg-gray-700">
            <strong className="text-xl"># {data.name}</strong>
            <p className="display-inline">{data.price} ETH</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
