import React, { useContext, useEffect, useState } from "react";

import Loader from "react-loader-spinner";

import { CoinContext } from "../context/CoinContext";
import ListBoxItem from "./ListBoxItem";

const ListBoxSearch = ({ setIsFocusInputActive, loadedCoins }) => {
  const { state, getCoin, searchCoins, getCoinMarkets } =
    useContext(CoinContext);
  const { coinSearch } = state;

  const [filteredCoins, setFilteredCoins] = useState([]);

  useEffect(() => {
    setFilteredCoins(
      loadedCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(coinSearch.toLowerCase())
      )
    );
  }, [coinSearch, loadedCoins]);

  const handleClick = () => {
    getCoinMarkets([]);
    setIsFocusInputActive(false);
    searchCoins("");
    getCoin({});
  };

  return (
    <div className="overlay-background">
      <div
        className="list-box-search"
        onClick={() => setIsFocusInputActive(false)}
      >
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
