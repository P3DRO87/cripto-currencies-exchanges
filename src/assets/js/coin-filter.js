import numeral from "numeral";

export const dollarFilter = (value, format) => {
  if (!value) return "$0";

  return numeral(value).format(format);
};

export const percentFilter = (value) => {
  if (!value) return "0%";

  return `${Number(value).toFixed(2)}%`;
};
