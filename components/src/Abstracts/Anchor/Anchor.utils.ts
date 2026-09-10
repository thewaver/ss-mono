import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../ElementObserver/ElementObserver.utils";
import { ElevationUtils } from "../Elevation/Elevation.utils";
import { useViewportContext } from "../Viewport/Viewport.context";
import type { AnchorBand, AnchorBandKind, AnchorHPlacement, AnchorPlacement, AnchorVPlacement } from "./Anchor.types";

const H_FAMILIES: Record<AnchorHPlacement, readonly AnchorHPlacement[]> = {
    "left-in": ["left-in", "right-in"],
    "right-in": ["right-in", "left-in"],
    "left-out": ["left-out", "right-out"],
    "right-out": ["right-out", "left-out"],
    "center": ["center", "left-in", "right-in"],
};
const V_FAMILIES: Record<AnchorVPlacement, readonly AnchorVPlacement[]> = {
    "top-in": ["top-in", "bottom-in"],
    "bottom-in": ["bottom-in", "top-in"],
    "top-out": ["top-out", "bottom-out"],
    "bottom-out": ["bottom-out", "top-out"],
    "center": ["center", "top-in", "bottom-in"],
};
const getOverflow = (start: number, size: number, limit: number, reserved: number) =>
    Math.max(0, reserved - start) + Math.max(0, start + size - (limit - reserved));

export namespace AnchorUtils {
    export const getHPlacementShift = (hPlacement: AnchorHPlacement, anchorRect: Rect, contentSize: Size2d) => {
        switch (hPlacement) {
            case "left-in": {
                return anchorRect.x;
            }
            case "left-out": {
                return anchorRect.x - contentSize.width;
            }
            case "right-in": {
                return anchorRect.x + anchorRect.width - contentSize.width;
            }
            case "right-out": {
                return anchorRect.x + anchorRect.width;
            }
            case "center": {
                return anchorRect.x + (anchorRect.width - contentSize.width) * 0.5;
            }
        }
    };

    export const getVPlacementShift = (vPlacement: AnchorVPlacement, anchorRect: Rect, contentSize: Size2d) => {
        switch (vPlacement) {
            case "top-in": {
                return anchorRect.y;
            }
            case "top-out": {
                return anchorRect.y - contentSize.height;
            }
            case "bottom-in": {
                return anchorRect.y + anchorRect.height - contentSize.height;
            }
            case "bottom-out": {
                return anchorRect.y + anchorRect.height;
            }
            case "center": {
                return anchorRect.y + (anchorRect.height - contentSize.height) * 0.5;
            }
        }
    };

    export const getHPlacementOffset = (hPlacement: AnchorHPlacement, offsetX: number) => {
        switch (hPlacement) {
            case "left-in":
            case "right-out":
                return offsetX;
            case "left-out":
            case "right-in":
                return -offsetX;
            default:
                return 0;
        }
    };

    export const getVPlacementOffset = (vPlacement: AnchorVPlacement, offsetY: number) => {
        switch (vPlacement) {
            case "top-in":
            case "bottom-out":
                return offsetY;
            case "top-out":
            case "bottom-in":
                return -offsetY;
            default:
                return 0;
        }
    };

    export const getBand = (
        kind: AnchorBandKind,
        anchorStart: number,
        anchorSize: number,
        offset: number,
        limit: number,
        reserved: number,
    ): AnchorBand => {
        const first = reserved;
        const last = limit - reserved;

        if (kind === "before") return { start: first, end: Math.max(first, anchorStart - offset) };
        if (kind === "after") return { start: Math.min(last, anchorStart + anchorSize + offset), end: last };

        return { start: first, end: last };
    };

    export const getHBandKind = (hPlacement: AnchorHPlacement): AnchorBandKind =>
        hPlacement === "left-out" ? "before" : hPlacement === "right-out" ? "after" : "over";

    export const getVBandKind = (vPlacement: AnchorVPlacement): AnchorBandKind =>
        vPlacement === "top-out" ? "before" : vPlacement === "bottom-out" ? "after" : "over";

    export const clampToBand = (start: number, size: number, band: AnchorBand, kind: AnchorBandKind) => {
        if (kind === "before") return Math.min(start, band.end - size);
        if (kind === "after") return Math.max(start, band.start);

        return Math.max(band.start, Math.min(start, band.end - size));
    };

    export const getBandSize = (band: AnchorBand) => Math.max(0, band.end - band.start);

    export const getSafeHPlacement = (
        hPlacement: AnchorHPlacement,
        anchorRect: Rect,
        contentSize: Size2d,
        screenSize: Size2d,
        offsetSize?: Point2d,
        reservedScreenSize?: Size2d,
    ): AnchorHPlacement => {
        const offsetX = offsetSize?.x ?? 0;
        const reservedW = reservedScreenSize?.width ?? 0;

        const getCandidateOverflow = (candidate: AnchorHPlacement) =>
            getOverflow(
                getHPlacementShift(candidate, anchorRect, contentSize)! + getHPlacementOffset(candidate, offsetX),
                contentSize.width,
                screenSize.width,
                reservedW,
            );

        return H_FAMILIES[hPlacement].reduce((best, candidate) =>
            getCandidateOverflow(candidate) < getCandidateOverflow(best) ? candidate : best,
        );
    };

    export const getSafeVPlacement = (
        vPlacement: AnchorVPlacement,
        anchorRect: Rect,
        contentSize: Size2d,
        screenSize: Size2d,
        offsetSize?: Point2d,
        reservedScreenSize?: Size2d,
    ): AnchorVPlacement => {
        const offsetY = offsetSize?.y ?? 0;
        const reservedH = reservedScreenSize?.height ?? 0;

        const getCandidateOverflow = (candidate: AnchorVPlacement) =>
            getOverflow(
                getVPlacementShift(candidate, anchorRect, contentSize)! + getVPlacementOffset(candidate, offsetY),
                contentSize.height,
                screenSize.height,
                reservedH,
            );

        return V_FAMILIES[vPlacement].reduce((best, candidate) =>
            getCandidateOverflow(candidate) < getCandidateOverflow(best) ? candidate : best,
        );
    };

    export const getStackingBase = (element: HTMLElement | undefined) => {
        let node: HTMLElement | null = element ?? null;
        let base = 0;

        while (node) {
            const zIndex = Number.parseInt(getComputedStyle(node).zIndex, 10);

            if (!Number.isNaN(zIndex)) base = Math.max(base, zIndex);

            node = node.parentElement;
        }

        return base;
    };

    export const createPortalPosition = (
        getAnchorRef: Accessor<HTMLElement | undefined>,
        getIsVisible: Accessor<boolean>,
        opts: {
            getPlacement: Accessor<AnchorPlacement>;
            getOffset?: () => Point2d;
            getReservedScreenSize?: () => Size2d;
            getAnchorRect?: () => Rect | undefined;
            getIsPinned?: () => boolean;
        },
    ) => {
        const viewportContext = useViewportContext();

        const [getContentRef, setContentRef] = createSignal<HTMLElement>();
        const [getContentSize, setContentSize] = createSignal<Size2d | undefined>(undefined, {
            equals: Size2d.isSame,
        });
        const [getObservedRect, setAnchorRect] = createSignal<Rect | undefined>(undefined, {
            equals: Rect.isSame,
        });

        const getAnchorRect = createMemo(() => opts.getAnchorRect?.() ?? getObservedRect());

        const getPlacement = createMemo((): AnchorPlacement => {
            const contentSize = getContentSize();
            const anchorRect = getAnchorRect();
            const screenSize: Size2d = {
                width: viewportContext.getSize().width,
                height: viewportContext.getSize().height,
            };
            const offset = opts.getOffset?.();
            const placement = opts.getPlacement();
            const reservedScreenSize = opts.getReservedScreenSize?.();

            if (!contentSize || !anchorRect || opts.getIsPinned?.()) return placement;

            return {
                x: getSafeHPlacement(placement.x, anchorRect, contentSize, screenSize, offset, reservedScreenSize),
                y: getSafeVPlacement(placement.y, anchorRect, contentSize, screenSize, offset, reservedScreenSize),
            };
        });

        const getBands = createMemo(() => {
            const anchorRect = getAnchorRect();
            const placement = getPlacement();
            const screenSize = viewportContext.getSize();
            const reservedScreenSize = opts.getReservedScreenSize?.();
            const offset = opts.getOffset?.();

            const kinds = {
                x: anchorRect ? getHBandKind(placement.x) : ("over" as const),
                y: anchorRect ? getVBandKind(placement.y) : ("over" as const),
            };

            return {
                kinds,
                x: getBand(
                    kinds.x,
                    anchorRect?.x ?? 0,
                    anchorRect?.width ?? 0,
                    offset?.x ?? 0,
                    screenSize.width,
                    reservedScreenSize?.width ?? 0,
                ),
                y: getBand(
                    kinds.y,
                    anchorRect?.y ?? 0,
                    anchorRect?.height ?? 0,
                    offset?.y ?? 0,
                    screenSize.height,
                    reservedScreenSize?.height ?? 0,
                ),
            };
        });

        const getPosition = createMemo(() => {
            const anchorRect = getAnchorRect();
            const contentSize = getContentSize();
            const placement = getPlacement();
            const bands = getBands();

            if (!anchorRect || !contentSize) return;

            const x =
                getHPlacementShift(placement.x, anchorRect, contentSize) +
                getHPlacementOffset(placement.x, opts.getOffset?.().x ?? 0);
            const y =
                getVPlacementShift(placement.y, anchorRect, contentSize) +
                getVPlacementOffset(placement.y, opts.getOffset?.().y ?? 0);

            if (opts.getIsPinned?.()) return { x, y };

            return {
                x: clampToBand(x, contentSize.width, bands.x, bands.kinds.x),
                y: clampToBand(y, contentSize.height, bands.y, bands.kinds.y),
            };
        });

        const getIsAnchorOnScreen = createMemo(() => {
            const anchorRect = getAnchorRect();

            if (!anchorRect) return true;

            const screenSize = viewportContext.getSize();

            return (
                anchorRect.x + anchorRect.width > 0 &&
                anchorRect.y + anchorRect.height > 0 &&
                anchorRect.x < screenSize.width &&
                anchorRect.y < screenSize.height
            );
        });

        const getZIndex = createMemo(() => {
            if (!getIsVisible()) return 1;

            const anchorRef = getAnchorRef();

            return Math.max(getStackingBase(anchorRef), ElevationUtils.getBase(anchorRef)) + 1;
        });

        ElementObserverUtils.createViewportRectObserver(getAnchorRef, () => getIsVisible() && !opts.getAnchorRect, {
            setElementRect: setAnchorRect,
        });

        createEffect(() => {
            let contentResizeObserver: ResizeObserver | undefined;

            onCleanup(() => {
                contentResizeObserver?.disconnect();
                setContentSize(undefined);
            });

            const contentRef = getContentRef();
            const isVisible = getIsVisible();

            if (!contentRef || !isVisible) return;

            contentResizeObserver = new ResizeObserver(() => {
                setContentSize({ width: contentRef.offsetWidth, height: contentRef.offsetHeight });
            });
            contentResizeObserver.observe(contentRef);
        });

        return { getAnchorRect, getIsAnchorOnScreen, getPlacement, getPosition, getZIndex, setContentRef };
    };
}
