import { GetStaticPaths } from "next";
import duration from "../../../../lib/duration";
import DefinitionDiffPageWrapper, {
  getStaticProps as origGetStaticProps,
} from "../[table]";

const validDiffType = [
  "added",
  "removed",
  "unclassified",
  "reclassified",
  "modified",
];

interface Params {
  id: string;
  table: string;
  diffType?: string;
  [key: string]: any;
}

export default DefinitionDiffPageWrapper;

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: typeof origGetStaticProps = async (context) => {
  const diffType = context?.params?.diffType;

  if (!diffType) {
    return { notFound: true, revalidate: duration("1 week") };
  } else if (!validDiffType.includes(diffType)) {
    return { notFound: true, revalidate: duration("1 week") };
  }

  return origGetStaticProps(context);
};

// export const config = {
//   unstable_runtimeJS: false,
// };
