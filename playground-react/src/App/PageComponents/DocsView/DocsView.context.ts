import { createContext, useContext } from "react";

import type { DocsSectionRegistration } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

type DocsViewContextValue = {
    register: (section: DocsSectionRegistration) => () => void;
};

const DocsViewContext = createContext<DocsViewContextValue | undefined>(undefined);

export const DocsViewContextProvider = DocsViewContext.Provider;

export const useDocsViewContext = () => useContext(DocsViewContext);
