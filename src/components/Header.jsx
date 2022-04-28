import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import MainLogo from "../assets/main-logo.png";
import ListBoxSearch from "./ListBoxSearch";
import { CoinContext } from "../context/CoinContext";

import { fetchCoins } from "../assets/js/fetchCoins";

const Header = () => {
   const { pathname } = useLocation();

   const { state, searchCoins, getCoin } = useContext(CoinContext);
   const { coin, coinSearch, BASE_URL, limit } = state;

   const [isFocusInputActive, setIsFocusInputActive] = useState(false);
   const [loadedCoins, setLoadedCoins] = useState([]);

   const isCorrectPath = pathname.includes("/coin");

   const isListBoxActive = coin && isCorrectPath && isFocusInputActive && coinSearch;

   useEffect(() => {
      let isMounted = true;

      document.addEventListener("click", (e) => {
         !e.target.matches("#search") && setIsFocusInputActive(false);
      });

      fetchCoins(limit).then((coins) => {
         if (!isMounted) return;

         !coin ? setLoadedCoins(coins.slice(0, 3)) : setLoadedCoins(coins);
      });

      return () => (isMounted = false);
   }, [BASE_URL, coin, limit]);

   const handleResetCoin = () => {
      const [, , id] = pathname.split("/");

      if (coin.id !== id) getCoin({});
   };

   return (
      <header>
         <div className="container-fluid">
            <div className="row justify-content-between">
               <div className="col-lg-3 col-sm-6">
                  <div className="logo-container">
                     <Link
                        onClick={() => searchCoins("")}
                        className="main-link d-flex"
                        to="/"
                     >
                        <div className="img-logo-container">
                           <img className="main-logo" src={MainLogo} alt="Cripto coins" />
                        </div>
                        <p>
                           Criptocurrencies <span>Exchanges</span>
                        </p>
                     </Link>
                  </div>
               </div>
               <div className="col-lg-4 col-sm-6 position-relative d-flex align-items-center">
                  <div className="search-bar-container w-100">
                     <input
                        id="search"
                        value={coinSearch}
                        type="text"
                        className="form-control"
                        name="search"
                        onChange={(e) => searchCoins(e.target.value)}
                        onFocus={() => setIsFocusInputActive(true)}
                        autoComplete="off"
                     />
                     <div className="search-icon-container">
                        <i className="fas fa-search"></i>
                     </div>
                     {isListBoxActive && (
                        <ListBoxSearch
                           loadedCoins={loadedCoins}
                           setIsFocusInputActive={setIsFocusInputActive}
                        />
                     )}
                  </div>
               </div>
               <div className="col-lg-3 col-sm-12 d-flex align-items-center">
                  <ul className="link-list">
                     {loadedCoins.slice(0, 3).map((coin) => (
                        <li onClick={handleResetCoin} key={coin.id}>
                           <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
