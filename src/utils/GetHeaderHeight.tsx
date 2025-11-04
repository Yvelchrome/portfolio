export function getHeaderHeight(defaultHeight = 80) {
  if (typeof window === "undefined") return defaultHeight;

  const header = document.querySelector("header");
  return header ? header.getBoundingClientRect().height : defaultHeight;
}
