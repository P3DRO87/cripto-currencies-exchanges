import numeral from "numeral";

export const dollarFilter = (value, format) => {
   if (!value) return "$0";

   return numeral(value).format(format);
};

export const percentFilter = (value) => {
   if (!value) return "0%";

   return `${Number(value).toFixed(2)}%`;
};

export const parsePriceUsd = (priceUsd) => {
   const numPriceUsd = parseFloat(priceUsd);

   const parsedPriceUsd = dollarFilter(numPriceUsd, "$0.00a");

   const [, stringPrice] = parsedPriceUsd.split("$");

   return stringPrice === "0.00" ? `$${numPriceUsd.toFixed(6)}` : parsedPriceUsd;
};

export const parseCurrencyPriceUsd = (priceUsd) => {
   const currencyPriceUsd = parseFloat(priceUsd).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
   });

   return currencyPriceUsd === ("$0.00" || "0.00")
      ? `$${parseFloat(priceUsd).toFixed(6)}`
      : currencyPriceUsd;
};
