import React from "react";

import s from "./styles.module.scss";

export default function SiteHeader() {
  return (
    <div className={s.root}>
      <h1 className={s.title}>Destiny definition archive</h1>
    </div>
  );
}
