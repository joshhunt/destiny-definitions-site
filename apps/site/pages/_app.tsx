import Head from "next/head";
import Router from "next/router";
import { AppProps as NextAppProps } from "next/app";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import SiteHeader, { Breadcrumb } from "../components/SiteHeader";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "./common.scss";

import React, { useEffect, useMemo, useState } from "react";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

config.autoAddCss = false;

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export interface Meta {
  canonical?: string;
  buildDate?: string;
}

export interface PageProps {
  breadcrumbs?: Breadcrumb[];
  meta?: Meta;
}

interface AppProps extends NextAppProps {
  pageProps: PageProps;
}

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const meta = pageProps.meta ?? {};
  const buildDate = useMemo(() => new Date(meta.buildDate ?? ""), []);
  return (
    <>
      <Head>
        <title>Destiny definition versions</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        {meta.canonical && <link rel="canonical" href={`${meta.canonical}`} />}
      </Head>

      <SiteHeader breadcrumbs={pageProps.breadcrumbs} />

      <Component {...pageProps} />

      {buildDate && (
        <p style={{ margin: 32, fontSize: 14, opacity: 0.75 }}>
          Page built {longFormatDate(buildDate)}
          {isClient &&
            ` (${formatDistanceToNowStrict(buildDate, {
              addSuffix: true,
            })})`}
          . {isClient && "Client JS running."}
        </p>
      )}
    </>
  );
}

function longFormatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date(date));
}
