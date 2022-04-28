import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { CoinContext } from "../context/CoinContext";
import { dollarFilter, parseCurrencyPriceUsd } from "../assets/js/coin-filter";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";
import Loader from "react-loader-spinner";
import ExchangeBtn from "../components/ExchangeBtn";
import CoinDetailHero from "../components/CoinDetailHero";
import { fetchCoinDetail } from "../assets/js/fetchCoins";

const CoinDetail = () => {
   const { id } = useParams();

   const { state, dispatch } = useContext(CoinContext);
   const { coin, coinHistory, coinMarkets } = state;

   useEffect(() => {
      dispatch({ type: "SEARCH_COIN", payload: "" });
   }, [dispatch]);

   useEffect(() => {
      let isMounted = true;

      const getCoinDetail = () => {
         fetchCoinDetail(id)
            .then(([coin, coinH, coinM]) => {
               if (!isMounted) return;

               dispatch({ type: "GET_COIN", payload: coin.data.data });
               dispatch({ type: "GET_COIN_HISTORY", payload: coinH.data.data });
               dispatch({ type: "GET_COIN_MARKET", payload: coinM.data.data });
            })
            .catch(() => getCoinDetail());
      };

      getCoinDetail();

      return () => {
         isMounted = false;
         dispatch({ type: "SEARCH_COIN", payload: "" });
         dispatch({ type: "GET_COIN", payload: null });
      };
   }, [id, dispatch]);

   const dataHistoryCoin = () => coinHistory.map((h) => [h.date, parseFloat(h.priceUsd)]);

   const historyMax = () => Math.max(...coinHistory.map((h) => parseFloat(h.priceUsd)));

   const historyMin = () => Math.min(...coinHistory.map((h) => parseFloat(h.priceUsd)));

   const historyAvg = () => Math.abs(...coinHistory.map((h) => parseFloat(h.priceUsd)));

   return (
      <>
         {!coin && (
            <div className="loader-container">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-sm-auto mt-5 d-flex justify-content-center">
                        <Loader color="#363636" type="Oval" />
                     </div>
                  </div>
               </div>
            </div>
         )}
         {coin && (
            <>
               <CoinDetailHero />
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-6">
                        <div className="price-info">
                           <p>
                              HIGH: <span>{parseCurrencyPriceUsd(historyMax())}</span>
                           </p>
                           <p>
                              LOW: <span>{parseCurrencyPriceUsd(historyMin())}</span>
                           </p>
                           <p>
                              AVERAGE: <span>{parseCurrencyPriceUsd(historyAvg())}</span>
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <div className="mt-5 coin-chart-container">
                           <AreaChart
                              data={dataHistoryCoin()}
                              max={historyMax()}
                              min={historyMin()}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <h2 className="mt-5">Best Exchanges</h2>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-l-12">
                        <div className="exchange-section">
                           <div className="table-responsive">
                              <table className="table">
                                 <thead>
                                    <tr>
                                       <th>Exchange</th>
                                       <th>Pair</th>
                                       <th>Price</th>
                                       <th></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {coinMarkets.map((item, index) => (
                                       <tr key={`${item.exchangeId}-${item.priceUsd}`}>
                                          <td>{item.exchangeId}</td>
                                          <td>
                                             {item.baseSymbol} / {item.quoteSymbol}
                                          </td>
                                          <td>{dollarFilter(coin.priceUsd, "$0.00a")}</td>
                                          <td>
                                             {!item.exchangeUrl ? (
                                                <ExchangeBtn item={item} index={index} />
                                             ) : (
                                                <a
                                                   target="_blank"
                                                   rel="noreferrer"
                                                   href={item.exchangeUrl}
                                                >
                                                   {item.exchangeUrl}
                                                </a>
                                             )}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )}
      </>
   );
};
export default CoinDetail;
