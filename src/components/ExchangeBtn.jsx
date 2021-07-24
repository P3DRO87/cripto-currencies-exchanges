import React, { useContext, useEffect, useState } from "react";

import Loader from "react-loader-spinner";

import { CoinContext } from "../context/CoinContext";

const ExchangeBtn = ({ item, index }) => {
  const { getExchange } = useContext(CoinContext);

  const [isExchangeLoading, setIsExchangeLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    return () => isMounted;
  }, []);

  return (
    <>
      {isExchangeLoading ? (
        <button className="btn btn-dark">
          <Loader color="#fff" height={20} width={60} />
        </button>
      ) : (
        <button
          onClick={async () => {
            setIsExchangeLoading(true);
            await getExchange(item.exchangeId, index);
          }}
          className="btn btn-dark"
        >
          Get Link
        </button>
      )}
    </>
  );
};

export default ExchangeBtn;
