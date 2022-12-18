import { ReactElement } from "react";

interface BungieImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function BungieImage({ src, ...rest }: BungieImageProps) {
  if (!src) {
    return null;
  }
  return (
    <img
      loading="lazy"
      src={`https://www.bungie.net${src || "/img/misc/missing_icon_d2.png"}`}
      {...rest}
    />
  );
}
