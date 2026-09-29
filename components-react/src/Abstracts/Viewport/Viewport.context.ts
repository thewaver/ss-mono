import { createContext, useContext } from "react";

import type { ViewportContextType } from "@thewaver/ss-components";

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

const getWindowRect = () => DOMRect.fromRect({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });

const WINDOW_VIEWPORT: ViewportContextType = {
    getPortalRef: () => undefined,
    getSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
    getScale: () => 1,
    getScaledRect: getWindowRect,
};

export const ViewportContextProvider = ViewportContext.Provider;

export const useParentViewportContext = () => useContext(ViewportContext);

export const useViewportContext = (): ViewportContextType => useContext(ViewportContext) ?? WINDOW_VIEWPORT;
