export const filterCoins = (coins, coinSearch) => {
   return coins.filter(
      ({ name, symbol }) =>
         name.toLowerCase().includes(coinSearch) ||
         symbol.toLowerCase().includes(coinSearch)
   );
};
