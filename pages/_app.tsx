import Head from "next/head";
import { AppProps } from "next/app";

import "./common.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Destiny definition versions</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
