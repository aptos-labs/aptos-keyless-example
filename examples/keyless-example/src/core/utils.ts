export const collapseAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const normalizeUrl = (url: string): string => {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`;
  }
  if (!url.endsWith("/")) {
    url += "/";
  }
  return url;
};
