import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../context/CoinContext";

import { dollarFilter, percentFilter } from "../assets/js/coin-filter";
import { fetchCoin } from "../assets/js/fetchCoins";

const CoinDetailHero = () => {
   const { state } = useContext(CoinContext);
   const { coin } = state;

   const [loadedCoin, setLoadedCoin] = useState(coin);
   const [isUsd, setIsUsd] = useState(true);
   const [valToConvert, setValToConvert] = useState("");
   const [isImgErr, setIsImgErr] = useState(false);

   const convertValue = () => (isUsd ? setIsUsd(false) : setIsUsd(true));

   useEffect(() => {
      let interval;

      interval = setInterval(() => {
         fetchCoin(coin.id)
            .then((coin) => setLoadedCoin(coin))
            .catch((e) => e);
      }, 10000);

      return () => clearInterval(interval);
   }, [coin.id]);

   return (
      loadedCoin && (
         <div className="container-fluid hero-background">
            <div className="container h-100">
               <div className="row h-100 align-items-center justify-content-between">
                  <div className="col-lg-auto">
                     <div className="ranking-box">
                        <h1>{loadedCoin.rank}</h1>
                        <p>RANK</p>
                     </div>
                  </div>
                  <div className="col-lg-3">
                     <div className="d-flex align-items-center mb-4">
                        <div className="coin-img-container">
                           <img
                              onError={() => setIsImgErr(true)}
                              src={
                                 isImgErr
                                    ? "https://via.placeholder.com/55"
                                    : `https://static.coincap.io/assets/icons/${loadedCoin.symbol.toLowerCase()}@2x.png`
                              }
                              alt={loadedCoin.name}
                           />
                        </div>
                        <div className="coin-info-wrap">
                           <div className="coin-info">
                              <h2 className="coin-detail-title m-0">{loadedCoin.name}</h2>
                              <small>{loadedCoin.symbol}</small>
                           </div>
                        </div>
                     </div>
                     <div className="price-usd-container d-flex align-items-center">
                        <h3 className="me-3">
                           {parseFloat(loadedCoin.priceUsd).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                           })}
                        </h3>
                        <h5
                           className={`${
                              loadedCoin.changePercent24Hr.includes("-")
                                 ? "danger"
                                 : "success"
                           } m-0 d-flex`}
                        >
                           {percentFilter(loadedCoin.changePercent24Hr, 2)}
                           {loadedCoin.changePercent24Hr.includes("-") ? (
                              <i className="ms-1 mt-1 fas fa-caret-down"></i>
                           ) : (
                              <i className="ms-1 mt-1 fas fa-caret-up"></i>
                           )}
                        </h5>
                     </div>
                  </div>
                  <div className="col-md-4">
                     <div className="row">
                        <div className="col-lg-5 col-sm-8">
                           <div className="coin-info-container">
                              <small>Market Cap</small>
                              <p>{dollarFilter(loadedCoin.marketCapUsd, "$0.000a")}</p>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="coin-info-container">
                              <small>Volume (24Hr)</small>
                              <p>{dollarFilter(loadedCoin.volumeUsd24Hr, "$0.000a")}</p>
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-md-auto">
                           <a
                              className="btn explorer-link shadow-hover"
                              href={loadedCoin.explorer}
                           >
                              Explorer
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                     <div className="covert-box">
                        <button onClick={convertValue} className="btn explorer-link">
                           {isUsd
                              ? `USD to ${loadedCoin.symbol}`
                              : `${loadedCoin.symbol} to USD`}
                        </button>
                        <input
                           onChange={(e) => {
                              if (e.target.type !== "number") return;
                              setValToConvert(parseInt(e.target.value) || "");
                           }}
                           type="number"
                           className="form-control"
                           value={valToConvert}
                        />
                        <p>
                           {!valToConvert
                              ? isUsd
                                 ? `0 ${loadedCoin.symbol}`
                                 : `$0`
                              : isUsd
                              ? `${valToConvert / loadedCoin.priceUsd} ${
                                   loadedCoin.symbol
                                }`
                              : `$${valToConvert * loadedCoin.priceUsd}`}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   );
};

export default CoinDetailHero;
