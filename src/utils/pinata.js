const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const token = process.env.REACT_APP_PINATA_TOKEN;

export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios 
        .post(url, JSONBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            console.log("JSON uploaded", response.data)
            return {
                status: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                status: false,
                message: error.message,
            }

    });
};

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    let data = new FormData();

    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'nftimage',
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 1
    });
    data.append('pinataOptions', pinataOptions);

    return axios.post(url, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/form-data`,
        }
    })
    .then(function (response) {
        console.log("Image uploaded", response.data)
        return {
            status: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    })
    .catch(function (error) {
        console.log(error)
        return {
            status: false,
            message: error.message,
        }
    });
};