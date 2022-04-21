import React, { useContext, useEffect, useState } from "react";

import Loader from "react-loader-spinner";
import { filterCoins } from "../assets/js/filterCoins";

import { CoinContext } from "../context/CoinContext";
import ListBoxItem from "./ListBoxItem";

const ListBoxSearch = ({ setIsFocusInputActive, loadedCoins }) => {
   const { state, getCoin, searchCoins } = useContext(CoinContext);
   const { coinSearch } = state;

   const [filteredCoins, setFilteredCoins] = useState([]);

   useEffect(() => {
      const filteredCoins = filterCoins(loadedCoins, coinSearch);

      setFilteredCoins(filteredCoins);
   }, [coinSearch, loadedCoins]);

   const handleClick = () => {
      setIsFocusInputActive(false);
      searchCoins("");
      getCoin(null);
   };

   return (
      <div className="overlay-background">
         <div className="list-box-search" onClick={() => setIsFocusInputActive(false)}>
            {loadedCoins.length === 0 && (
               <div className="d-flex justify-content-center mt-2">
                  <Loader color="#fff" />
               </div>
            )}
            {filteredCoins.map((coin) => (
               <ListBoxItem key={coin.id} coin={coin} handleClick={handleClick} />
            ))}
         </div>
      </div>
   );
};

export default ListBoxSearch;
