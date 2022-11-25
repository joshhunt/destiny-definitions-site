import React from "react";

import Link from "next/link";

import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import Interpose from "../Interpose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";

export interface Breadcrumb {
  label: string;
  to: string;
}

interface SiteHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export default function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <div className={s.root}>
      <div className={s.breadcrumbs}>
        <Interpose
          node={
            <FontAwesomeIcon className={s.seperator} icon={faChevronRight} />
          }
        >
          <h1 className={s.title}>
            <Link className={commonStyles.invisibleLink} href="/">
              Destiny Definitions Archive
            </Link>
          </h1>

          {breadcrumbs &&
            breadcrumbs.map((crumb) => (
              <div key={crumb.to} className={s.childCrumb}>
                {crumb.to ? (
                  <Link className={commonStyles.invisibleLink} href={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </div>
            ))}
        </Interpose>
      </div>
    </div>
  );
}
