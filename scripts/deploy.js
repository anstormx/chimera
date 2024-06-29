const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    //retrieve contract factory
    const ContractFactory = await ethers.getContractFactory("NFTMARKET");
    const contract = await ContractFactory.deploy();
    //wait for the contract to be deployed
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    }

    //This writes the ABI and address to json file
    fs.writeFileSync('./src/marketplace.json', JSON.stringify(data))

    console.log("File written to ./src/marketplace.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });