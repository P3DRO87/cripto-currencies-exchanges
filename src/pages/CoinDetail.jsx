import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { CoinContext } from "../context/CoinContext";

import axios from "axios";
import { dollarFilter } from "../assets/js/coin-filter";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";
import Loader from "react-loader-spinner";
import ExchangeBtn from "../components/ExchangeBtn";
import isObjEmpty from "../assets/js/is-object-empty";
import CoinDetailHero from "../components/CoinDetailHero";

const CoinDetail = () => {
  const { state, dispatch } = useContext(CoinContext);

  const { BASE_URL, coin, coinHistory, coinMarkets } = state;

  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const getCoinHistoryUrl = () => {
      const now = new Date();
      const end = now.getTime();
      now.setDate(now.getDate() - 1);
      const start = now.getTime();

      return `${BASE_URL}/assets/${id}/history?interval=h1&start=${start}&end=${end}`;
    };

    const COIN_URL = `${BASE_URL}/assets/${id}`;
    const COIN_HISTORY_URL = getCoinHistoryUrl();
    const COIN_MARKETS_URL = `${BASE_URL}/assets/${id}/markets?limit=5`;

    const coinData = axios.get(COIN_URL);
    const coinHistoryData = axios.get(COIN_HISTORY_URL);
    const coinMarketsData = axios.get(COIN_MARKETS_URL);

    Promise.all([coinData, coinHistoryData, coinMarketsData]).then(
      ([coin, coinH, coinM]) => {
        if (isMounted) {
          dispatch({ type: "GET_COIN", payload: coin.data.data });
          dispatch({ type: "GET_COIN_HISTORY", payload: coinH.data.data });
          dispatch({ type: "GET_COIN_MARKET", payload: coinM.data.data });
        }
      }
    );

    return () => (isMounted = false);
  }, [BASE_URL, id, dispatch]);

  const dataHistoryCoin = () =>
    coinHistory.map((h) => [h.date, parseFloat(h.priceUsd)]);

  const historyMax = () =>
    Math.max(...coinHistory.map((h) => parseFloat(h.priceUsd)));

  const historyMin = () =>
    Math.min(...coinHistory.map((h) => parseFloat(h.priceUsd)));

  const historyAvg = () =>
    Math.abs(...coinHistory.map((h) => parseFloat(h.priceUsd)));

  return (
    <>
      {isObjEmpty(coin) && (
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
      {!isObjEmpty(coin) && (
        <>
          <CoinDetailHero id={id} />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="price-info">
                  <p>
                    HIGH: <span>${historyMax().toFixed(2)}</span>
                  </p>
                  <p>
                    LOW: <span>${historyMin().toFixed(2)}</span>
                  </p>
                  <p>
                    AVERAGE: <span>${historyAvg().toFixed(2)}</span>
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
