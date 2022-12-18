interface BungieImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const imageProxyPrefix = process.env.NEXT_PUBLIC_IMAGE_PROXY;

export function getBungieImageURL(src: string) {
  return `https://www.bungie.net${src}`;
}

export function getCacheImageURL(src: string) {
  if (!imageProxyPrefix) {
    return src;
  }

  return imageProxyPrefix + src;
}

export default function BungieImage({ src, ...rest }: BungieImageProps) {
  if (!src) {
    return null;
  }

  const bungieUrl = getBungieImageURL(src || "/img/misc/missing_icon_d2.png");
  const cacheUrl = getCacheImageURL(bungieUrl);

  return <img loading="lazy" src={cacheUrl} {...rest} />;
}
