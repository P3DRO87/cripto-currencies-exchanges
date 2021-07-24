import Skeleton from "react-loading-skeleton";

const arr30 = Array(30);

for (let index = 0; index < arr30.length; index++) {
  arr30[index] = index;
}

const Loader = () => {
  return (
    <>
      {arr30.map((index) => (
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
