import { createContext, useContext } from "react";

import type { PagePropsPanelScope } from "./PropsPanelReact.types";

const PropsPanelContext = createContext<{ scope: PagePropsPanelScope } | undefined>(undefined);

export const PropsPanelContextProvider = PropsPanelContext.Provider;

export const usePropsPanelContext = () => useContext(PropsPanelContext);
