import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dollarFilter, parsePriceUsd, percentFilter } from "../assets/js/coin-filter";

const CoinItem = ({ coin, priceWs }) => {
   const [coinPriceUsd, setCoinPriceUsd] = useState(coin.priceUsd);
   const [isImgErr, setIsImgErr] = useState(false);
   const [flashCoinClass, setFlashCoinClass] = useState(null);

   const parseCoinImg = coin.symbol.toLowerCase();

   useEffect(() => {
      let isMounted = true;

      if (!isMounted) return;

      setIsImgErr(false);

      return () => (isMounted = false);
   }, []);

   useEffect(() => {
      let timeout;

      let isMounted = true;

      priceWs.onmessage = ({ data }) => {
         const priceWsUsd = JSON.parse(data)[coin.id];

         setCoinPriceUsd((prev) => {
            setFlashCoinClass(priceWsUsd > prev ? "flash-green" : "flash-red");

            return priceWsUsd;
         });

         timeout = setTimeout(() => isMounted && setFlashCoinClass(null), 700);
      };

      return () => {
         priceWs.onmessage = null;
         clearTimeout(timeout);
         isMounted = false;
      };
   }, [priceWs, coin.id]);

   return (
      <tr className={flashCoinClass ? flashCoinClass : undefined}>
         <td className="img-container">
            <img
               onError={() => setIsImgErr(true)}
               src={
                  isImgErr
                     ? "https://via.placeholder.com/64"
                     : `https://static.coincap.io/assets/icons/${parseCoinImg}@2x.png`
               }
               alt={coin.name}
            />
         </td>
         <td>#{coin.rank}</td>
         <td className="coin-name">
            <a
               className="coin-link"
               target="_blank"
               href={coin.explorer}
               rel="noreferrer"
            >
               {coin.name}
            </a>
            <small>{coin.symbol}</small>
         </td>
         <td>{parsePriceUsd(coinPriceUsd || coin.priceUsd)}</td>
         <td>{dollarFilter(coin.marketCapUsd, "$0.00a")}</td>
         <td
            className={`coin-percent ${
               coin.changePercent24Hr.includes("-") ? "text-danger" : "text-success"
            }`}
         >
            {percentFilter(coin.changePercent24Hr, 2)}
         </td>
         <td>
            <Link to={`coin/${coin.id}`} className="btn btn-dark">
               Details
            </Link>
         </td>
      </tr>
   );
};

export default CoinItem;
