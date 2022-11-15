import { GetStaticPaths } from "next";
import Home, { getStaticProps as getStaticPropsImport } from "../index";

export default Home;
export const getStaticProps = getStaticPropsImport;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
