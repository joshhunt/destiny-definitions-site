import React from "react";

import s from "./404.module.scss";

// pages/404.js
export default function Custom500() {
  return (
    <div className={s.root}>
      <div className={s.block}>
        <h1 className={s.title}>500</h1>
        <p className={s.desc}>Internal server error</p>
      </div>
    </div>
  );
}
