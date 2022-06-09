import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
// import fetch from 'node-fetch';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);

  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching nfts");

    const baseURL = "https://eth-mainnet.alchemyapi.io/v2/pYJGwyv5GrN9Cwmh2BHbXS2do3IdM60y/getNFTs/"; 

    if (!collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json()); 
    } else {
      console.log("Fetching nfts for collection owned by address"); 

      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json()); 
    }

    if (nfts) {
     console.log("nfts:", nfts);
     setNFTs(nfts); 
    }

  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div> 
        <input onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address "></input>
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label><input type={"checkbox"}></input></label>
        <button onClick={
          () => {
            fetchNFTs()
          }
        }> Let's go</button>
      </div>
    </div>
  )
}

export default Home