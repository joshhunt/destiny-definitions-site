import duration from "./duration";

export default function notFound(dur = duration("1 day")) {
  return { notFound: true, revalidate: dur };
}
