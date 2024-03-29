export const collapseAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
