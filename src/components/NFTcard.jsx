import {Link} from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile ({data}) {
    var newTo;
    if (data.tokenID) {
        newTo = {
            pathname:"/nftPage/"+data.tokenID
        }
    }
    else {
        newTo = {
            pathname:"/nftPage/"+data.tokenId
        }
    }

    const IPFSUrl = GetIpfsUrlFromPinata(data.image);

    return (
        <div className="ml-12 mt-5 mb-10 flex flex-col items-center rounded-2xl w-48 md:w-72 shadow-2xl border-purple-900" style={{borderWidth: '3px'}}>
            <Link to={newTo} className="relative w-full">
                <img src={IPFSUrl} alt="nftimage" className="w-72 h-80 rounded-xl object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-purple-900 text-white p-2 rounded-b-lg bg-opacity-95">
                    <strong className="text-xl">{data.name}</strong>
                    <p className="display-inline">
                        {data.price} ETH
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default NFTTile;
