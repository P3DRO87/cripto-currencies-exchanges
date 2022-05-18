import axios from "axios";

const BASE_URL = "https://api.coincap.io/v2";

export const fetchCoins = async (limit = 30, signal) => {
   return fetch(`${BASE_URL}/assets?limit=${limit}`, { signal })
      .then((res) => res.json())
      .then((res) => res.data);
};

export const fetchCoin = (id) => {
   return fetch(`${BASE_URL}/assets/${id}`)
      .then((res) => res.json())
      .then((res) => res.data);
};

export const getCoinHistoryUrl = (id) => {
   const now = new Date();
   const end = now.getTime();
   now.setDate(now.getDate() - 1);
   const start = now.getTime();

   return `${BASE_URL}/assets/${id}/history?interval=h1&start=${start}&end=${end}`;
};

export const fetchCoinDetail = async (id) => {
   const COIN_URL = `${BASE_URL}/assets/${id}`;
   const COIN_HISTORY_URL = getCoinHistoryUrl(id);
   const COIN_MARKETS_URL = `${BASE_URL}/assets/${id}/markets?limit=5`;

   const coinData = axios.get(COIN_URL);
   const coinHistoryData = axios.get(COIN_HISTORY_URL);
   const coinMarketsData = axios.get(COIN_MARKETS_URL);

   const coinDetail = await Promise.all([coinData, coinHistoryData, coinMarketsData]);

   return coinDetail;
};
