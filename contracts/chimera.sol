//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMARKET is ERC721URIStorage, ReentrancyGuard{
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs; //most recent minted token ID
    Counters.Counter private _itemsSold; //number of items sold on the marketplace
    uint256 listingPrice; //fee to list an NFT
    address payable owner;
    
    constructor() ERC721("Chimera", "CHM") {
        owner = payable(msg.sender);
        listingPrice = 0.001 ether;
    }

    //structure to store info about a listed token
    struct listedToken { 
        uint256 tokenID;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //event emitted when a token is successfully listed
    event tokenListed (  
        uint256 indexed tokenID,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //mapping to store tokenId to token info
    mapping (uint256 => listedToken) private idToListedToken;

    function updateListingPrice(uint256 _listingPrice) public {
        require(msg.sender == owner, "Only the owner can update the listing price");
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getLatestListedToken() public view returns (listedToken memory) {
        return idToListedToken[_tokenIDs.current()];
    }

    function getListedToken(uint256 tokenID) public view returns (listedToken memory) {
        return idToListedToken[tokenID];
    }

    function getCurrentTokenID() public view returns (uint256) {
        return _tokenIDs.current();
    }
    
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(msg.value >= listingPrice, "Please submit the listing fee in order to list the item");
        require(price > 0, "Price must be a positive number");

        //transfer the listing fee to the owner
        payable(owner).transfer(msg.value); 
        
        //increment the token ID
        _tokenIDs.increment();

        uint256 newTokenID = _tokenIDs.current();
        //mint the token to the sender
        _safeMint(msg.sender, newTokenID);
        //set the token URI for the token
        _setTokenURI(newTokenID, tokenURI);
        //helper function emit the event
        createTokenEmit(newTokenID, price);

        return newTokenID;
    }

    function createTokenEmit(uint256 tokenID, uint256 price) private {
        idToListedToken[tokenID] = listedToken (
            tokenID, 
            payable(msg.sender),
            payable(msg.sender),
            price,
            false
        );

        //emit the event
        emit tokenListed(
            tokenID, 
            msg.sender, 
            msg.sender, 
            price, 
            false
        );
    }

    function updateTokenPrice(uint256 tokenID, uint256 price) public nonReentrant {
        require(idToListedToken[tokenID].seller == msg.sender, "Only item owner can perform this operation"); 
        require(price > 0, "Price must be at least 1 wei");

        idToListedToken[tokenID].price = price;
    }

    function updateListingStatus(uint256 tokenID) public nonReentrant  {
        require(idToListedToken[tokenID].seller == msg.sender, "Only item owner can perform this operation");
        if (!idToListedToken[tokenID].currentlyListed) {
            idToListedToken[tokenID].currentlyListed = true;
            _transfer (msg.sender, address(this), tokenID);
            idToListedToken[tokenID].owner = payable(address(this));
        } else {
            idToListedToken[tokenID].currentlyListed = false;
            _transfer(address(this), msg.sender, tokenID);
            idToListedToken[tokenID].owner = idToListedToken[tokenID].seller;
        }
    }
    

    //returns all the NFTs that are currently listed in the marketplace
    function getMarketTokens() public view returns (listedToken[] memory) {
        uint256 totalTokenCount = _tokenIDs.current();  
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalTokenCount; i++) { 
            if(idToListedToken[i].currentlyListed == true) { 
                itemCount += 1;
            }
        }
        
        listedToken[] memory tokens = new listedToken[](itemCount);
        for (uint256 i = 1; i <= totalTokenCount; i++) {
            if(idToListedToken[i].currentlyListed == true) { 
                listedToken storage currentItem = idToListedToken[i];
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return tokens;
    }

    function getMyNFTs() public view returns (listedToken[] memory) {
        uint256 totalTokenCount = _tokenIDs.current();  
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalTokenCount; i++) { 
            if(idToListedToken[i].seller == msg.sender || idToListedToken[i].owner == msg.sender) { 
                itemCount += 1;
            }
        }
        
        listedToken[] memory tokens = new listedToken[](itemCount);
        for (uint256 i = 1; i <= totalTokenCount; i++) {
            if(idToListedToken[i].seller == msg.sender || idToListedToken[i].owner == msg.sender) {
                listedToken storage currentItem = idToListedToken[i];
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return tokens;
    }
    
    //creates sale of the NFT and transfers the token to the buyer
    function executeTokenSale(uint256 tokenID) public payable nonReentrant{
        require(msg.value >= idToListedToken[tokenID].price, "Please submit the asking price in order to complete the purchase");

        address seller = idToListedToken[tokenID].seller;
        
        //update the token info
        idToListedToken[tokenID].currentlyListed = false;  
        idToListedToken[tokenID].owner = payable(msg.sender);
        idToListedToken[tokenID].seller = payable(msg.sender);
        
        _itemsSold.increment();

        //actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenID);
       
        //transfer the funds to the seller
        payable(seller).transfer(msg.value);

        //emit the event
        emit tokenListed(
            tokenID, 
            msg.sender, 
            msg.sender, 
            idToListedToken[tokenID].price, 
            false
        );
    }
}