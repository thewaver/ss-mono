import { FunctionUtils, RectUtils } from "@thewaver/ss-utils";
import type { Size2d } from "@thewaver/ss-utils";

import type { ViewportContextType } from "../../Abstracts/Viewport/Viewport.context.types";
import { ViewportUtils } from "../../Abstracts/Viewport/Viewport.utils";
import type { ViewportWrapperFit } from "./ViewportWrapper.types";

/** How often a window resize is allowed to re-fit the root viewport. */
const WINDOW_RESIZE_THROTTLE_MS = 10;

const getWindowInnerSize = (): Size2d => ({ width: window.innerWidth, height: window.innerHeight });

/**
 * The parts of a viewport wrapper that are not about any framework: how it fits its design size into the space it
 * is given, where that lands on screen, and how the space is watched.
 */
export namespace ViewportWrapperUtils {
    /** The space a nested viewport has before its host has been measured. */
    export const NO_SIZE: Size2d = { width: 0, height: 0 };

    /**
     * The space a viewport starts with before anything has been observed.
     *
     * @param isNested Whether another viewport encloses this one.
     * @returns The window's inner size for the root viewport, and nothing for a nested one, whose host is measured.
     */
    export const getInitialAvailableSize = (isNested: boolean) => (isNested ? NO_SIZE : getWindowInnerSize());

    /**
     * Fits the size a viewport is designed for into the space it has.
     *
     * @param size The design size.
     * @param availableSize The space it is given.
     * @returns The scale it is drawn at, and the rectangle it occupies within that space.
     */
    export const computeFit = (size: Size2d, availableSize: Size2d): ViewportWrapperFit => {
        const rect = RectUtils.fit(size, availableSize);

        return { scale: rect.scale, scaleRect: new DOMRect(rect.x, rect.y, rect.width, rect.height) };
    };

    /**
     * The scale a viewport's contents are actually drawn at on screen: its own fit times every enclosing viewport's.
     *
     * @param fit The viewport's own fit.
     * @param parentContext The enclosing viewport, if any.
     * @returns The composed scale.
     */
    export const computeScale = (fit: ViewportWrapperFit, parentContext: ViewportContextType | undefined) =>
        (parentContext?.getScale() ?? 1) * fit.scale;

    /**
     * Where a viewport's contents land in window pixels.
     *
     * The root viewport's fit already is that. A nested one is carried up through its host's client rect and the
     * parent's scale, and is read afresh on every call, since the host moves whenever anything above it scrolls.
     *
     * @param fit The viewport's own fit.
     * @param host The viewport's host element, once it exists.
     * @param parentContext The enclosing viewport, if any.
     * @returns The rectangle, in window pixels.
     */
    export const computeScaledRect = (
        fit: ViewportWrapperFit,
        host: HTMLElement | undefined,
        parentContext: ViewportContextType | undefined,
    ) => {
        const rect = fit.scaleRect;

        if (!parentContext || !host) return rect;

        const composed = ViewportUtils.composeScaledRect(rect, host.getBoundingClientRect(), parentContext.getScale());

        return new DOMRect(composed.x, composed.y, composed.width, composed.height);
    };

    /**
     * The transform that places and scales a viewport's design box inside its host.
     *
     * @param fit The viewport's own fit.
     * @returns A CSS `transform` value.
     */
    export const computeTransform = (fit: ViewportWrapperFit) =>
        `translate(${fit.scaleRect.left}px, ${fit.scaleRect.top}px) scale(${fit.scale}, ${fit.scale})`;

    /**
     * Watches the space a viewport is given.
     *
     * The root viewport's space is the window, followed through a throttled `resize` listener. A nested one's is its
     * host box, followed through a `ResizeObserver`, so a consumer sizes it with ordinary CSS and passes nothing in.
     *
     * @param host The host element, which a nested viewport measures. Missing means there is nothing to watch yet.
     * @param isNested Whether another viewport encloses this one.
     * @param onSize Receives each new size.
     * @returns A function that stops watching.
     */
    export const observeAvailableSize = (
        host: HTMLElement | undefined,
        isNested: boolean,
        onSize: (size: Size2d) => void,
    ) => {
        if (!isNested) {
            let isStopped = false;

            const throttleResize = FunctionUtils.trailingThrottle(() => {
                if (isStopped) return;

                onSize(getWindowInnerSize());
            }, WINDOW_RESIZE_THROTTLE_MS);

            window.addEventListener("resize", throttleResize);

            return () => {
                isStopped = true;
                window.removeEventListener("resize", throttleResize);
            };
        }

        if (!host) return () => undefined;

        const observer = new ResizeObserver(() => onSize({ width: host.clientWidth, height: host.clientHeight }));

        observer.observe(host);

        return () => observer.disconnect();
    };
}
