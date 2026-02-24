import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}
