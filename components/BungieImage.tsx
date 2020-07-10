import { ReactElement } from "react";

interface BungieImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function BungieImage({ src, ...rest }: BungieImageProps) {
  if (!src) return null;
  return <img src={`https://www.bungie.net${src}`} {...rest} />;
}
