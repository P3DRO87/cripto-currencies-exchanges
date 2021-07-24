import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLogo from "../assets/main-logo.png";
import ListBoxSearch from "./ListBoxSearch";
import { CoinContext } from "../context/CoinContext";
import isObjEmpty from "../assets/js/is-object-empty";

import axios from "axios";

const Header = () => {
  const { state, getCoin, searchCoins, getCoinMarkets } =
    useContext(CoinContext);
  const { coin, coinSearch, BASE_URL } = state;

  const isCorrectPath = window.location.pathname.includes("/coin");
  const [isFocusInputActive, setIsFocusInputActive] = useState(false);
  const [loadedCoins, setLoadedCoins] = useState([]);

  const isListBoxActive =
    !isObjEmpty(coin) && isCorrectPath && isFocusInputActive && coinSearch;

  useEffect(() => {
    document.addEventListener("click", (e) => {
      !e.target.matches("#search") && setIsFocusInputActive(false);
    });

    axios.get(`${BASE_URL}/assets?limit=130`).then((res) => {
      isObjEmpty(coin)
        ? setLoadedCoins(res.data.data.slice(0, 3))
        : setLoadedCoins(res.data.data);
    });
  }, [BASE_URL, coin]);

  const handleClick = () => {
    getCoin({});
    getCoinMarkets([]);
  };

  return (
    <header>
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-lg-auto col-sm-6">
            <div className="logo-container">
              <Link className="main-link d-flex" to="/">
                <div className="img-logo-container">
                  <img
                    className="main-logo"
                    src={MainLogo}
                    alt="cripto coins..."
                  />
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
                <li key={coin.id}>
                  <Link
                    onClick={() => {
                      const isSamePath =
                        window.location.pathname.split("coin/")[1] === coin.id;
                      if (!isSamePath) handleClick();
                    }}
                    to={`/coin/${coin.id}`}
                  >
                    {coin.name}
                  </Link>
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
