import React from "react";

import Link from "next/link";

import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { Breadcrumb } from "../../types";
import Interpose from "../Interpose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
            <Link href="/">
              <a className={commonStyles.invisibleLink}>
                Destiny Definitions Archive
              </a>
            </Link>
          </h1>

          {breadcrumbs &&
            breadcrumbs.map((crumb) => (
              <div key={crumb.to} className={s.childCrumb}>
                {crumb.to ? (
                  <Link href={crumb.to}>
                    <a className={commonStyles.invisibleLink}>{crumb.label}</a>
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
