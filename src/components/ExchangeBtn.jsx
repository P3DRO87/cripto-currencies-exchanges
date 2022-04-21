import React, { useContext, useState } from "react";

import Loader from "react-loader-spinner";

import { CoinContext } from "../context/CoinContext";

const ExchangeBtn = ({ item, index }) => {
   const { getExchange } = useContext(CoinContext);

   const [isExchangeLoading, setIsExchangeLoading] = useState(false);

   const handleClick = () => {
      setIsExchangeLoading(true);
      getExchange(item.exchangeId, index);
   };

   return (
      <>
         {isExchangeLoading ? (
            <button className="btn btn-dark">
               <Loader color="#fff" height={20} width={60} />
            </button>
         ) : (
            <button onClick={handleClick} className="btn btn-dark">
               Get Link
            </button>
         )}
      </>
   );
};

export default ExchangeBtn;
