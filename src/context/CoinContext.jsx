import React, { createContext, useReducer } from "react";

import CoinReducer from "./CoinReducer";

import axios from "axios";

export const CoinContext = createContext();

const BASE_URL = "https://api.coincap.io/v2";

export const CoinProvider = ({ children }) => {
  const initialState = {
    BASE_URL,
    coins: null,
    limit: 30,
    coin: {},
    coinSearch: "",
    coinHistory: [],
    coinMarkets: [],
  };

  const [state, dispatch] = useReducer(CoinReducer, initialState);

  const getCoins = async (limit) => {
    await axios.get(`${BASE_URL}/assets?limit=${limit || 30}`).then((res) => {
      dispatch({
        type: "GET_COINS",
        payload: res.data.data,
      });
    });
  };

  const getCoin = (coin) => {
    dispatch({
      type: "GET_COIN",
      payload: coin,
    });
  };

  const getCoinHistory = (coinHistory) => {
    dispatch({
      type: "GET_COIN_HISTORY",
      payload: coinHistory,
    });
  };

  const getCoinMarkets = (coinMarkets) => {
    let coinMarketsHasExchageUrl = state.coinMarkets
      .map((coin) => coin.hasOwnProperty("exchangeUrl"))
      .some((coin) => coin === true);

    dispatch({
      type: "GET_COIN_MARKET",
      payload:
        coinMarketsHasExchageUrl && coinMarkets.length !== 0
          ? state.coinMarkets.map((coin) =>
              coin.exchangeUrl
                ? { ...coin, exchangeUrl: coin.exchangeUrl }
                : coin
            )
          : coinMarkets,
    });
  };

  const getExchange = async (id, index) => {
    const url =
      id.includes(".") && !id.includes(" ")
        ? `${BASE_URL}/exchanges/${id.split(".")[0]}`
        : `${BASE_URL}/exchanges/${id.split(" ")[0].replace(".", "-")}`;

    await axios
      .get(url.includes("Coinbase") ? `${BASE_URL}/exchanges/gdax` : url)
      .then((res) => {
        const exchangeUrl = res.data.data.exchangeUrl;

        dispatch({
          type: "GET_EXCHANGE",
          payload: state.coinMarkets.map((coin, i) =>
            i === index ? { ...coin, exchangeUrl } : coin
          ),
        });
      });
  };

  const searchCoins = (coinSearch) =>
    dispatch({
      type: "SEARCH_COIN",
      payload: coinSearch,
    });

  return (
    <CoinContext.Provider
      value={{
        state,
        dispatch,
        getCoins,
        getCoin,
        getCoinHistory,
        getCoinMarkets,
        getExchange,
        searchCoins,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export default CoinProvider;
