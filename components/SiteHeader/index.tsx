import React from "react";

import Link from "next/link";

import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";

export default function SiteHeader() {
  return (
    <div className={s.root}>
      <h1 className={s.title}>
        <Link href={`/`} as={`/`}>
          <a className={commonStyles.invisibleLink}>
            Destiny Definitions Archive
          </a>
        </Link>
      </h1>
    </div>
  );
}
