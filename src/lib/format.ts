export const formatPrice = (value: number | string): string =>
  `KES ${Number(value).toLocaleString("en-US")}`;