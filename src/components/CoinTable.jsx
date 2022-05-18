import React, { useContext, useEffect, useState } from "react";

import { CoinContext } from "../context/CoinContext";

import CoinItem from "./CoinItem";
import SkeletonLoader from "./SkeletonLoader";
import LoadMoreBtn from "./LoadMoreBtn";
import { fetchCoins } from "../assets/js/fetchCoins";
import { filterCoins } from "../assets/js/filterCoins";

const PRICES_WS = "wss://ws.coincap.io/prices?assets";

const CoinTable = () => {
   const { state, dispatch } = useContext(CoinContext);
   const { coins, coinSearch, limit, filteredCoins, socket } = state;

   const [isLoading, setIsLoading] = useState(true);
   const [pricesWs, setPricesWs] = useState(socket);

   useEffect(() => {
      dispatch({ type: "SEARCH_COIN", payload: "" });
   }, [dispatch]);

   useEffect(() => {
      let isMounted = true;

      let controller = new AbortController();
      const { signal } = controller;

      const getCoins = () => {
         fetchCoins(limit, signal)
            .then((coins) => {
               dispatch({ type: "GET_COINS", payload: coins });
            })
            .catch(() => null)
            .finally(() => {
               if (!isMounted) return;

               setIsLoading(false);
            });
      };

      getCoins();

      return () => {
         isMounted = false;
         controller.abort();
      };
   }, [dispatch, limit]);

   useEffect(() => {
      let interval;

      interval = setInterval(() => {
         fetchCoins(limit)
            .then((coins) => {
               dispatch({ type: "GET_COINS", payload: coins });
            })
            .catch((e) => e);
      }, 10000);

      return () => clearInterval(interval);
   }, [limit, dispatch]);

   useEffect(() => {
      if (!coins) return;

      const filteredCoins = filterCoins(coins, coinSearch);

      dispatch({ type: "SET_FILTERED_COINS", payload: filteredCoins });
   }, [coinSearch, coins, dispatch]);

   useEffect(() => {
      dispatch({ type: "SET_SOCKET", payload: pricesWs });
   }, [pricesWs, dispatch]);

   useEffect(() => {
      if (!coins) return;

      setPricesWs((prev) => {
         if (!prev) {
            const pricesWs = coins.map(({ id }) => new WebSocket(`${PRICES_WS}=${id}`));

            return pricesWs;
         }

         const nextCoins = coins.slice(prev.length);

         const nextPricesWs = nextCoins.map(
            ({ id }) => new WebSocket(`${PRICES_WS}=${id}`)
         );

         return [...prev, ...nextPricesWs];
      });
   }, [coins]);

   return (
      <div className="container">
         <div className="row justify-content-center">
            <div className="col-lg-10">
               <div className="table-container">
                  <div className="table-responsive">
                     <table
                        className={`table ${
                           (filteredCoins?.length || !isLoading) && "table-hover"
                        }`}
                     >
                        <thead>
                           <tr>
                              <th></th>
                              <th># Rank</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Market Cap.</th>
                              <th>Variation 24hrs</th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           {isLoading && <SkeletonLoader />}
                           {!isLoading &&
                              (filteredCoins?.length ? (
                                 filteredCoins.map((coin, index) => (
                                    <CoinItem
                                       key={coin.id}
                                       priceWs={
                                          pricesWs ? pricesWs[index] : coin.priceUsd
                                       }
                                       coin={coin}
                                    />
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan={7}>
                                       <h3>No results</h3>
                                    </td>
                                 </tr>
                              ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
         <div className="row justify-content-center">
            <div className="col-sm-auto d-flex justify-content-center">
               {!coinSearch && <LoadMoreBtn setIsLoading={setIsLoading} limit={limit} />}
            </div>
         </div>
      </div>
   );
};

export default CoinTable;
