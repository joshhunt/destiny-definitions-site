import React from "react";

import s from "./404.module.scss";

// pages/404.js
export default function Custom404() {
  return (
    <div className={s.root}>
      <div className={s.block}>
        <h1 className={s.title}>404</h1>
        <p className={s.desc}>
          This page could not be found.
          <br />
          New definitions are no longer being archived here.
        </p>
      </div>
    </div>
  );
}
