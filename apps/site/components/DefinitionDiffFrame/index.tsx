import { ManifestVersion } from "@destiny-definitions/common";

import s from "./styles.module.scss";

interface DefinitionDiffFrameProps {
  tableName: string;
  children: React.ReactNode;
}

export default function DefinitionDiffFrame({
  tableName,
  children,
}: DefinitionDiffFrameProps) {
  return (
    <div className={s.root}>
      <div className={s.main}>
        <h2 className={s.pageTitle}>{tableName}</h2>
        {children}
      </div>

      <div className={s.side}>
        <div className={s.stickySide}>
          pretend this is the table from the side
          {/* <IndexTable
            versionId={versionId}
            data={indexData}
            versionDiffCounts={versionDiffCounts}
          /> */}
        </div>
      </div>
    </div>
  );
}
