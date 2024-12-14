import { ManifestVersionSummary } from "@destiny-definitions/common";
import {
  faChevronLeft,
  faChevronRight,
  faChevronsRight,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Version from "../Version";

import s from "./styles.module.scss";

export interface IndexPageProps {
  versions: ManifestVersionSummary[];
  pagination: {
    hasPrevPage: boolean;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export default function Home({ versions, pagination }: IndexPageProps) {
  const { hasPrevPage, currentPage, hasNextPage, lastPage } = pagination;
  return (
    <div className={s.root}>
      <div className={s.versionList}>
        <div>
          <p>
            The Destiny Definition Archive has been retired, and won't recieve
            any new updates or list new definitions.{" "}
            <a style={{ color: "inherit" }} href="https://destiny.report">
              Read more.
            </a>
          </p>
        </div>
        <br /> <br />
        {versions.map((versionSummary) => {
          return (
            <Version key={versionSummary.id} versionSummary={versionSummary} />
          );
        })}
      </div>
      <br />
      <br />
      <div className={s.pagination}>
        {hasPrevPage && (
          <Link className={s.paginationLink} href={`/${currentPage - 1}`}>
            <FontAwesomeIcon
              className={s.paginationIcon}
              icon={faChevronLeft}
            />
            <span>Prev</span>
          </Link>
        )}

        <span>
          Page {currentPage} of {lastPage}
        </span>

        {hasNextPage && (
          <Link
            className={s.paginationLink}
            data-testid="pagination-next"
            href={`/${currentPage + 1}`}
          >
            <span>Next</span>
            <FontAwesomeIcon
              className={s.paginationIcon}
              icon={faChevronRight}
            />
          </Link>
        )}

        {currentPage !== lastPage && (
          <Link
            className={s.secretPaginationLink}
            data-testid="pagination-next"
            href={`/${currentPage + 1}`}
          >
            <span>Last</span>
            <FontAwesomeIcon
              className={s.paginationIcon}
              icon={faChevronsRight}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
