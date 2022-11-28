import React from "react";
import { useMemo } from "react";
import CustomDiffView from "./CustomDiffView";
import WrappedReactDiffViewer from "./WrappedReactDiffViewer";

interface JSONDiffProps {
  oldObject: unknown;
  newObject: unknown;
}

const MAX_LENGTH = 50_000;

export default function JSONDiff({ oldObject, newObject }: JSONDiffProps) {
  const { oldJSON, newJSON, useCustomDiff } = useMemo(() => {
    const oldJSON = JSON.stringify(oldObject, null, 2);
    const newJSON = JSON.stringify(newObject, null, 2);
    const useCustomDiff =
      oldJSON.length > MAX_LENGTH || newJSON.length > MAX_LENGTH;

    return { oldJSON, newJSON, useCustomDiff };
  }, []);

  if (useCustomDiff) {
    return (
      <>
        <p>
          <em>
            This definition is very large, so to not crash your browser it uses
            an alternate diff view
          </em>
        </p>
        <CustomDiffView oldJSON={oldJSON} newJSON={newJSON} />
      </>
    );
  }

  return <WrappedReactDiffViewer oldJSON={oldJSON} newJSON={newJSON} />;
}
