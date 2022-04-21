import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { CoinContext } from "../context/CoinContext";

const arr30 = Array(30);

for (let index = 0; index < arr30.length; index++) {
   arr30[index] = index;
}

const Loader = () => {
   const { state } = useContext(CoinContext);
   const { limit } = state;

   const coinsMask = Array(limit).fill("");

   return (
      <>
         {coinsMask.map((_, index) => (
            <tr key={index}>
               <td>
                  <Skeleton circle={true} height={50} width={50} />
               </td>
               <td>
                  <Skeleton />
               </td>
               <td>
                  <Skeleton />
               </td>
               <td>
                  <Skeleton />
               </td>
               <td>
                  <Skeleton />
               </td>
               <td>
                  <Skeleton />
               </td>
               <td></td>
            </tr>
         ))}
      </>
   );
};

export default Loader;
