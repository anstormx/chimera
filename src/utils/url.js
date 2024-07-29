export const GetIpfsUrlFromPinata = (pinataUrl) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl =
    "https://pink-naval-cardinal-905.mypinata.cloud/ipfs/" +
    IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};
