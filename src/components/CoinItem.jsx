import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { dollarFilter, percentFilter } from "../assets/js/coin-filter";
import { CoinContext } from "../context/CoinContext";

const CoinItem = ({ coin }) => {
  const { getCoin } = useContext(CoinContext);

  const parseCoinImg = coin.symbol.toLowerCase();

  const [isImgErr, setIsImgErr] = useState(false);

  const [flashCoinClass, setFlashCoinClass] = useState(null);

  const coinRef = useRef(null);

  useEffect(() => {
    setIsImgErr(false);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation) {
          const coinMutPrice = parseFloat(mutation.target.data.split("$")[1]);
          const coinPrice = parseFloat(
            dollarFilter(coin.priceUsd, "$0.00a").split("$")[1]
          );

          console.log(coinMutPrice > coinPrice);

          coinMutPrice > coinPrice
            ? setFlashCoinClass("flash-green")
            : setFlashCoinClass("flash-red");

          setTimeout(() => {
            setFlashCoinClass(null);
          }, 700);
        }
      });
    });

    const config = {
      childList: true,
      subtree: true,
      characterData: true,
    };

    observer.observe(coinRef.current, config);
  }, [coin?.priceUsd]);

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
      <td ref={coinRef}>{dollarFilter(coin.priceUsd, "$0.00a")}</td>
      <td>{dollarFilter(coin.marketCapUsd, "$0.00a")}</td>
      <td
        className={`coin-percent ${
          coin.changePercent24Hr.includes("-") ? "text-danger" : "text-success"
        }`}
      >
        {percentFilter(coin.changePercent24Hr, 2)}
      </td>
      <td>
        <Link
          onClick={() => getCoin({})}
          to={`coin/${coin.id}`}
          className="btn btn-dark"
        >
          Details
        </Link>
      </td>
    </tr>
  );
};

export default CoinItem;
