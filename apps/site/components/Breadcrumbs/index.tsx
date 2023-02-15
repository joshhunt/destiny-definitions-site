import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import Link from "next/link";
import React from "react";
import cx from "classnames";
import Interpose from "../Interpose";
import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { FormatDateShort } from "../DateTimeFormatters";
import { useRouter } from "next/router";

export interface Breadcrumb {
  label?: string;
  date?: string;
  to: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  children,
}) => {
  return (
    <div className={s.root}>
      <Interpose
        node={<FontAwesomeIcon className={s.seperator} icon={faChevronRight} />}
      >
        {children}

        {breadcrumbs.map((crumb, index) => (
          <Crumb key={index} crumb={crumb} />
        ))}
      </Interpose>
    </div>
  );
};

interface CrumbProps {
  crumb: Breadcrumb;
}

const Crumb: React.FC<CrumbProps> = ({ crumb }) => {
  const router = useRouter();
  const currentRoute = router.asPath;
  const isActive = crumb.to && crumb.to == currentRoute;

  return (
    <div className={s.childCrumb}>
      {crumb.to ? (
        <Link
          className={cx(commonStyles.invisibleLink, isActive && s.activeLink)}
          href={crumb.to}
        >
          {crumb.date ? <FormatDateShort date={crumb.date} /> : crumb.label}
        </Link>
      ) : (
        crumb.label
      )}
    </div>
  );
};

export default Breadcrumbs;
