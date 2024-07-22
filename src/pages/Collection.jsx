import NFTTile from "./components/NFTcard";
import { useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useHomeContext } from "../context/homeContext";
import { debounce } from "lodash";

export default function Home() {
  const { data, dataFetched, loading, getAllNFTs } = useHomeContext();
  const [delay, setDelay] = React.useState(0);

  const debounceGetAllNFTs = debounce(getAllNFTs, delay);

  useEffect(() => {
    if (!dataFetched) {
      debounceGetAllNFTs();
      setDelay(10000);
    }
  }, [dataFetched, debounceGetAllNFTs]);

  return (
    <div className="min-h-screen py-[2%] px-[8%]">
      <h2 className="font-bold text-3xl mb-4 text-center">Collection</h2>
      <div className="flex flex-col place-items-center">
        {loading ? (
          <div className="mt-14">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </div>
        ) : (
          <div>
            {data.length === 0 ? (
              "No NFT data to display"
            ) : (
              <div className="flex justify-center overflow-y-auto">
                <div className="flex flex-wrap justify-start max-w-screen-2xl w-full px-4">
                  {data.map((value, index) => {
                    return <NFTTile data={value} key={index} />;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
