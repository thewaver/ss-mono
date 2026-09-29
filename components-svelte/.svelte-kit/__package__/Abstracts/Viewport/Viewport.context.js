import { createContext } from "svelte";
import { innerHeight, innerWidth } from "svelte/reactivity/window";
const [getContext, setContext, hasContext] = createContext();
const getWindowWidth = () => innerWidth.current ?? window.innerWidth;
const getWindowHeight = () => innerHeight.current ?? window.innerHeight;
const WINDOW_VIEWPORT = {
    getPortalRef: () => undefined,
    getSize: () => ({ width: getWindowWidth(), height: getWindowHeight() }),
    getScale: () => 1,
    getScaledRect: () => DOMRect.fromRect({ x: 0, y: 0, width: getWindowWidth(), height: getWindowHeight() }),
};
export const setViewportContext = (context) => setContext(context);
export const getParentViewportContext = () => hasContext() ? getContext() : undefined;
export const getViewportContext = () => getParentViewportContext() ?? WINDOW_VIEWPORT;
