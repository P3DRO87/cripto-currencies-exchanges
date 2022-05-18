import numeral from "numeral";

export const dollarFilter = (value, format) => {
   if (!value) return "$0";

   return numeral(value).format(format);
};

export const percentFilter = (value) => {
   if (!value) return "0%";

   return `${Number(value).toFixed(2)}%`;
};

export const parsePriceUsd = (coinPrice) => {
   const parsedCoinPrice = parseFloat(coinPrice);

   const parsedPriceUsd = dollarFilter(parsedCoinPrice, "$0.00a");

   const [, stringPrice] = parsedPriceUsd.split("$");

   return stringPrice === "0.00" ? `$${parsedCoinPrice.toFixed(6)}` : parsedPriceUsd;
};

export const parseCurrencyPriceUsd = (priceUsd) => {
   const priceUsdCurrency = parseFloat(priceUsd).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
   });

   return priceUsdCurrency === "$0.00" ? parsePriceUsd(priceUsd) : priceUsdCurrency;
};
export const parsePriceInfo = (priceUsd) => {
   return priceUsd.toFixed(2) === "0.00" ? priceUsd.toFixed(6) : priceUsd.toFixed(2);
};
