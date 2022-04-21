const CoinReducer = (state, { type, payload }) => {
   if (!type) return;

   if (type === "GET_COINS") return { ...state, coins: payload };

   if (type === "SET_FILTERED_COINS") return { ...state, filteredCoins: payload };

   if (type === "SET_SOCKET") return { ...state, socket: payload };

   if (type === "SET_COINS_LIMIT") return { ...state, limit: payload };

   if (type === "GET_COIN") return { ...state, coin: payload };

   if (type === "GET_COIN_HISTORY") return { ...state, coinHistory: payload };

   if (type === "GET_COIN_MARKET") return { ...state, coinMarkets: payload };

   if (type === "GET_EXCHANGE") return { ...state, coinMarkets: payload };

   if (type === "SEARCH_COIN") return { ...state, coinSearch: payload };
};

export default CoinReducer;
