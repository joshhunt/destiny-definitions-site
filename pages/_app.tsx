import Head from "next/head";
import Router from "next/router";
import { AppProps as NextAppProps } from "next/app";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import SiteHeader from "../components/SiteHeader";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "./common.scss";

import { PageProps } from "../types";
import React from "react";

config.autoAddCss = false;

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface AppProps extends NextAppProps {
  pageProps: PageProps;
}

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
        <script src="/smoothScroll.js" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>

      <SiteHeader breadcrumbs={pageProps.breadcrumbs} />

      <Component {...(pageProps as any)} />
    </>
  );
}
