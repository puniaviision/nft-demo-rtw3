import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { NFTCard} from "./components/nftCard"
// import fetch from 'node-fetch';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const [NFTs, setNFTs] = useState([]);

  const [startToken, setStartToken] = useState("");

  let counter = 0;

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
     setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async (thisToken = "") => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      const baseURL = "https://eth-mainnet.alchemyapi.io/v2/pYJGwyv5GrN9Cwmh2BHbXS2do3IdM60y/getNFTsForCollection/";
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${thisToken}`;

      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      
      if (nfts){
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }

      setStartToken(nfts.nextToken);

      //console.log(previousToken);
      console.log(startToken);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2"> 
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address "></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className='text-gray-600'><input onChange={(e) => {setFetchForCollection(e.target.checked)}}type={"checkbox"} className="mr-2"></input>Fetch for collection </label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection(startToken);
            } else {
              fetchNFTs();
            }
          }
        }> Let's go</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
          {
            NFTs.length && NFTs.map(nft => {
              return (
                <NFTCard nft = {nft}></NFTCard>
              )
            })
          }
      </div>
      <div>
      <button disabled={!fetchForCollection || counter} className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/10 inline-block mr-3" onClick={
          () => {
            //console.log("the previous token will be: ",previousToken);
            fetchNFTsForCollection("");
            counter --;
          }
        }>Home Page</button>

        <button disabled={!fetchForCollection} className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/10 inline-block ml-3" onClick={
          () => {
            //console.log("the new start token will be: ",startToken);
            fetchNFTsForCollection(startToken);
            counter ++;
          }
        }>Next Page</button>
      </div>
    </div>
  )
}

export default Home