import React, { createContext, useReducer } from "react";

import CoinReducer from "./CoinReducer";

import axios from "axios";

export const CoinContext = createContext();

const BASE_URL = "https://api.coincap.io/v2";

export const CoinProvider = ({ children }) => {
   const initialState = {
      BASE_URL,
      socket: null,
      coins: null,
      filteredCoins: null,
      limit: 30,
      coin: {},
      coinSearch: "",
      coinHistory: [],
      coinMarkets: [],
   };

   const [state, dispatch] = useReducer(CoinReducer, initialState);

   const getCoins = async () => {
      const { coins } = state;

      const limit = !coins ? 30 : 20;

      const offset = coins?.length || 0;

      const res = await axios.get(`${BASE_URL}/assets?limit=${limit}&offset=${offset}`);

      dispatch({
         type: "GET_COINS",
         payload: !coins ? res.data.data : [...coins, ...res.data.data],
      });
   };

   const setSocket = (socket) => dispatch({ type: "SET_SOCKET", payload: socket });

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

   const getExchange = async (id, index) => {
      const url =
         id.includes(".") && !id.includes(" ")
            ? `${BASE_URL}/exchanges/${id.split(".")[0]}`
            : `${BASE_URL}/exchanges/${id.split(" ")[0].replace(".", "-")}`;

      axios
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
            getExchange,
            searchCoins,
            setSocket,
         }}
      >
         {children}
      </CoinContext.Provider>
   );
};

export default CoinProvider;
