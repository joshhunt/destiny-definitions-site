import Head from "next/head";
import { AppProps } from "next/app";

import SiteHeader from "../components/SiteHeader";

import "./common.scss";

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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

        <script src="https://kit.fontawesome.com/eb61b9b8d1.js"></script>
      </Head>

      <SiteHeader />

      <Component {...pageProps} />
    </>
  );
}
