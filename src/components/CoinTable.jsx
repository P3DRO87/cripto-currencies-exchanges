import React, { useContext, useEffect, useState } from "react";

import { CoinContext } from "../context/CoinContext";

import CoinItem from "./CoinItem";
import SkeletonLoader from "./SkeletonLoader";
import LoadMoreBtn from "./LoadMoreBtn";

const CoinTable = () => {
  const { state, getCoins } = useContext(CoinContext);
  const { coins, coinSearch, limit } = state;

  const [filteredCoins, setfilteredCoins] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!isLoading) {
      if (isMounted) {
        getCoins(limit);
        coins && setIsLoading(false);
        setfilteredCoins(
          coins &&
            coins.filter(
              (coin) =>
                coin.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(coinSearch.toLowerCase())
            )
        );
      }
    }

    return () => (isMounted = false);
  }, [getCoins, coins, coinSearch, limit, isLoading, setIsLoading]);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="table-container">
              <div className="table-responsive">
                <table
                  className={`table ${
                    filteredCoins && !isLoading && "table-hover"
                  }`}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th># Rank</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Market Cap.</th>
                      <th>Variation 24hrs</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!filteredCoins || isLoading) && <SkeletonLoader />}
                    {!isLoading &&
                      filteredCoins &&
                      (coins.length !== 0 && filteredCoins.length === 0 ? (
                        <tr>
                          <td colSpan={7}>
                            <h3>No results</h3>
                          </td>
                        </tr>
                      ) : (
                        filteredCoins.map((coin) => (
                          <CoinItem key={coin.id} coin={coin} />
                        ))
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-auto d-flex justify-content-center">
            {!coinSearch && (
              <LoadMoreBtn setIsLoading={setIsLoading} limit={limit} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinTable;
