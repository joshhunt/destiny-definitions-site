import { GetStaticPaths } from "next";
import DefinitionDiffPageWrapper, {
  getStaticProps as origGetStaticProps,
} from "../[table]";

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
  return origGetStaticProps(context);
};

export const config = {
  unstable_runtimeJS: false,
};
