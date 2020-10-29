import React, { useContext } from "react";
import { AllDefinitionDiffs } from "../types";

interface DiffDataContext {
  versionDiff?: AllDefinitionDiffs;
  versionId?: string;
}

export const diffDataContext = React.createContext<DiffDataContext>({});

export const DiffDataProvider = diffDataContext.Provider;

export const useDiffData = () => React.useContext(diffDataContext);
