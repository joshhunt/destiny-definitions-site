interface BungieImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function getBungieImageURL(src: string) {
  return `https://www.bungie.net${src}`;
}

export function getCacheImageURL(src: string) {
  return `https://destiny-definitions-image-proxy.fly.dev/${src}`;
}

export default function BungieImage({ src, ...rest }: BungieImageProps) {
  if (!src) {
    return null;
  }

  const bungieUrl = getBungieImageURL(src || "/img/misc/missing_icon_d2.png");
  const cacheUrl = getCacheImageURL(bungieUrl);

  return <img loading="lazy" src={cacheUrl} {...rest} />;
}
