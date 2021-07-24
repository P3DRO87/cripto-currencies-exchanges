import React, { useContext } from "react";
import { CoinContext } from "../context/CoinContext";

const LoadMoreBtn = ({ setIsLoading, limit }) => {
  const { getCoins, dispatch } = useContext(CoinContext);

  const handleClick = async () => {
    if (limit < 130) {
      setIsLoading(true);
      await getCoins(limit);
      dispatch({
        type: "SET_COINS_LIMIT",
        payload: limit + 20,
      });
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} className="btn btn-dark load-more-btn btn-lg">
      Load More
    </button>
  );
};

export default LoadMoreBtn;
