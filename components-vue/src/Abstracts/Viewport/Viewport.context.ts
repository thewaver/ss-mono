import { type InjectionKey, inject, provide, shallowRef } from "vue";

import type { ViewportContextType } from "@thewaver/ss-components";

const VIEWPORT_CONTEXT_KEY: InjectionKey<ViewportContextType> = Symbol("ViewportContext");

const getWindowRect = () => DOMRect.fromRect({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });

let windowViewport: ViewportContextType | undefined;

const getWindowViewport = (): ViewportContextType => {
    if (windowViewport) return windowViewport;

    const windowRect = shallowRef(getWindowRect());

    window.addEventListener("resize", () => {
        windowRect.value = getWindowRect();
    });

    windowViewport = {
        getPortalRef: () => undefined,
        getSize: () => ({ width: windowRect.value.width, height: windowRect.value.height }),
        getScale: () => 1,
        getScaledRect: () => windowRect.value,
    };

    return windowViewport;
};

export const provideViewportContext = (context: ViewportContextType) => provide(VIEWPORT_CONTEXT_KEY, context);

export const useParentViewportContext = () => inject(VIEWPORT_CONTEXT_KEY, undefined);

export const useViewportContext = (): ViewportContextType => useParentViewportContext() ?? getWindowViewport();
