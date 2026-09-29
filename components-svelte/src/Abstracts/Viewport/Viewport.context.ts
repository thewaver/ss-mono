import { createContext } from "svelte";
import { innerHeight, innerWidth } from "svelte/reactivity/window";

import type { ViewportContextType } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<ViewportContextType>();

const getWindowWidth = () => innerWidth.current ?? window.innerWidth;

const getWindowHeight = () => innerHeight.current ?? window.innerHeight;

const WINDOW_VIEWPORT: ViewportContextType = {
    getPortalRef: () => undefined,
    getSize: () => ({ width: getWindowWidth(), height: getWindowHeight() }),
    getScale: () => 1,
    getScaledRect: () => DOMRect.fromRect({ x: 0, y: 0, width: getWindowWidth(), height: getWindowHeight() }),
};

export const setViewportContext = (context: ViewportContextType) => setContext(context);

export const getParentViewportContext = (): ViewportContextType | undefined =>
    hasContext() ? getContext() : undefined;

export const getViewportContext = (): ViewportContextType => getParentViewportContext() ?? WINDOW_VIEWPORT;
