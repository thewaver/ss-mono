import { type PropsWithChildren, useMemo, useState } from "react";

import type { ViewportContextType } from "@thewaver/ss-components";

import { ViewportContextProvider } from "../../src";

const getWindowSize = () => ({ width: window.innerWidth, height: window.innerHeight });

export const ScreenLayer = (props: PropsWithChildren) => {
    const [portal, setPortal] = useState<HTMLElement>();

    const context = useMemo<ViewportContextType>(
        () => ({
            getPortalRef: () => portal,
            getSize: getWindowSize,
            getScale: () => 1,
            getScaledRect: () => DOMRect.fromRect({ x: 0, y: 0, ...getWindowSize() }),
        }),
        [portal],
    );

    return (
        <ViewportContextProvider value={context}>
            <div
                ref={(element) => setPortal(element ?? undefined)}
                style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}
            />
            {portal && props.children}
        </ViewportContextProvider>
    );
};

export const Overlay = ({ visibilityTarget, durationMs }: { visibilityTarget: 0 | 1; durationMs: number }) => (
    <div
        data-testid="overlay"
        style={{ background: "rgba(0, 0, 0, 0.4)", opacity: visibilityTarget, transition: `opacity ${durationMs}ms` }}
    />
);
