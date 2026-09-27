import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { ViewportContextType } from "@thewaver/ss-components";
import { ViewportWrapperStyles, ViewportWrapperUtils } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import { ViewportContextProvider, useParentViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import type { ViewportWrapperProps } from "./ViewportWrapper.types";

export const ViewportWrapper = (props: ViewportWrapperProps) => {
    const parentContext = useParentViewportContext();
    const isNested = parentContext !== undefined;

    const hostRef = useRef<HTMLDivElement | null>(null);
    const [portal, setPortal] = useState<HTMLElement>();
    const [availableSize, setAvailableSize] = useState(() => ViewportWrapperUtils.getInitialAvailableSize(isNested));

    const { width, height } = props.size;

    const fit = useMemo(
        () => ViewportWrapperUtils.computeFit({ width, height }, availableSize),
        [width, height, availableSize],
    );

    const scale = ViewportWrapperUtils.computeScale(fit, parentContext);

    useLayoutEffect(
        () =>
            ViewportWrapperUtils.observeAvailableSize(hostRef.current ?? undefined, isNested, (size) =>
                setAvailableSize((prev) => (isNested && Size2d.isSame(prev, size) ? prev : size)),
            ),
        [isNested],
    );

    const context = useMemo<ViewportContextType>(
        () => ({
            getPortalRef: () => portal,
            getSize: () => ({ width, height }),
            getScale: () => scale,
            getScaledRect: () =>
                ViewportWrapperUtils.computeScaledRect(fit, hostRef.current ?? undefined, parentContext),
        }),
        [portal, width, height, scale, fit, parentContext],
    );

    return (
        <div
            ref={hostRef}
            className={isNested ? ViewportWrapperStyles.viewportNestedHost : ViewportWrapperStyles.viewportRootHost}
        >
            <div
                className={ViewportWrapperStyles.viewportRoot}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: ViewportWrapperUtils.computeTransform(fit),
                }}
            >
                <ViewportContextProvider value={context}>
                    <div className={ViewportWrapperStyles.viewportContent}>
                        <div
                            ref={(element) => setPortal(element ?? undefined)}
                            className={ViewportWrapperStyles.viewportPortal}
                        />
                        {props.children}
                    </div>
                </ViewportContextProvider>
            </div>
        </div>
    );
};
