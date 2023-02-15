import React from "react";

import Link from "next/link";

import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { Breadcrumbs, Breadcrumb } from "../Breadcrumbs";

interface SiteHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export default function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <div className={s.root}>
      <div className={s.rootInner}>
        <Breadcrumbs breadcrumbs={breadcrumbs ?? []}>
          <h1 className={s.title}>
            <Link className={commonStyles.invisibleLink} href="/">
              Destiny Definitions Archive
            </Link>
          </h1>
        </Breadcrumbs>
      </div>
    </div>
  );
}
