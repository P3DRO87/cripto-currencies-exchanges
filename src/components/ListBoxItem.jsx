import React, { useState } from "react";

import { Link } from "react-router-dom";

const ListBoxItem = ({ coin, handleClick }) => {
  const [isImgErr, setIsImgErr] = useState(false);

  return (
    <Link
      onClick={() => {
        const isSamePath =
          window.location.pathname.split("coin/")[1] === coin.id;
        if (!isSamePath) handleClick();
      }}
      key={coin.id}
      to={`/coin/${coin.id}`}
    >
      <img
        onError={() => setIsImgErr(true)}
        src={
          isImgErr
            ? "https://via.placeholder.com/64"
            : `https://static.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`
        }
        alt={coin.name}
      />
      <span>{coin.name}</span>
    </Link>
  );
};

export default ListBoxItem;
