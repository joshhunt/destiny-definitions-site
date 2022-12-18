import React, { useContext } from "react";
import { AllDefinitionDiffs, ModifiedDeepDiffs } from "../types";

interface DiffDataContext {
  versionDiff: AllDefinitionDiffs;
  versionId: string;
  definitionName: string;
  modifiedDeepDiffs: ModifiedDeepDiffs;
}

export const diffDataContext = React.createContext<DiffDataContext>({
  versionId: "",
  definitionName: "",
  versionDiff: {},
  modifiedDeepDiffs: {},
});

export const DiffDataProvider = diffDataContext.Provider;

export const useDiffData = () => React.useContext(diffDataContext);
