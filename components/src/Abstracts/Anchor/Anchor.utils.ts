import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorBand, AnchorBandKind, AnchorHPlacement, AnchorPlacement, AnchorVPlacement } from "./Anchor.types";

/** For each horizontal placement, the placements to try if it does not fit, best first. */
const H_FAMILIES: Record<AnchorHPlacement, readonly AnchorHPlacement[]> = {
    "left-in": ["left-in", "right-in"],
    "right-in": ["right-in", "left-in"],
    "left-out": ["left-out", "right-out"],
    "right-out": ["right-out", "left-out"],
    "center": ["center", "left-in", "right-in"],
};
/** For each vertical placement, the placements to try if it does not fit, best first. */
const V_FAMILIES: Record<AnchorVPlacement, readonly AnchorVPlacement[]> = {
    "top-in": ["top-in", "bottom-in"],
    "bottom-in": ["bottom-in", "top-in"],
    "top-out": ["top-out", "bottom-out"],
    "bottom-out": ["bottom-out", "top-out"],
    "center": ["center", "top-in", "bottom-in"],
};
/** How many pixels a run of `size` starting at `start` spills past either edge of the usable space. */
const getOverflow = (start: number, size: number, limit: number, reserved: number) =>
    Math.max(0, reserved - start) + Math.max(0, start + size - (limit - reserved));

/**
 * Positions floating content against an anchor element, and keeps it on screen.
 *
 * A tooltip, a menu or a popover is described by which corner of the anchor it hangs off and
 * whether it sits inside or outside it. These turn that description into pixels, swap it for its
 * mirror image when the first choice would fall off the screen, and hold the result inside the
 * space that is actually free.
 *
 * Placements are named from the edge they line up with and whether the content stays inside the
 * anchor or goes outside it: `left-in` puts the content's left edge on the anchor's left edge,
 * `left-out` puts the content wholly to the anchor's left, and `center` splits the difference.
 */
export namespace AnchorUtils {
    /**
     * Where the content's left edge lands for a horizontal placement.
     *
     * @param hPlacement Which edge to line up with, and which side of it to sit on.
     * @param anchorRect The anchor, in the coordinate space the content is positioned in.
     * @param contentSize The content's measured size; needed because the placements that end at an
     * edge have to be shifted back by the content's own width.
     * @returns The left edge in that same space, before any offset or clamping.
     */
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

    /**
     * Where the content's top edge lands for a vertical placement.
     *
     * @param vPlacement Which edge to line up with, and which side of it to sit on.
     * @param anchorRect The anchor, in the coordinate space the content is positioned in.
     * @param contentSize The content's measured size; needed because the placements that end at an
     * edge have to be shifted back by the content's own height.
     * @returns The top edge in that same space, before any offset or clamping.
     */
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

    /**
     * Turns a horizontal gap into a shift in the direction that actually opens the gap.
     *
     * A gap has to push the content away from the anchor, and which way that is depends on the
     * placement — the same number moves `left-out` content left and `right-out` content right. This
     * signs it so a caller can state one gap and have it mean the same thing everywhere.
     *
     * @param hPlacement The placement the gap applies to.
     * @param offsetX How wide the gap should be, as a positive number.
     * @returns The signed shift, or `0` for `center`, which has no side to be pushed away from.
     */
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

    /**
     * Turns a vertical gap into a shift in the direction that actually opens the gap.
     *
     * @param vPlacement The placement the gap applies to.
     * @param offsetY How tall the gap should be, as a positive number.
     * @returns The signed shift, or `0` for `center`, which has no side to be pushed away from.
     */
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

    /**
     * Works out the run of screen the content is allowed to occupy along one axis.
     *
     * Content placed outside the anchor must not cross back over it, so the space it may use runs from
     * the edge of the screen up to the anchor rather than the whole width. Content placed over the
     * anchor may use everything. Naming that run once means the clamp afterwards does not have to know
     * which case it is in.
     *
     * @param kind `"before"` for content on the low side of the anchor, `"after"` for the high side,
     * `"over"` for content overlapping it.
     * @param anchorStart The anchor's own start along this axis.
     * @param anchorSize The anchor's extent along this axis.
     * @param offset The gap being held between anchor and content.
     * @param limit The screen's extent along this axis.
     * @param reserved A margin kept clear at both ends, for a fixed header or a safe area.
     * @returns The band's `start` and `end`. A band can come back empty when the anchor is already
     * against the edge.
     */
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

    /**
     * Which side of the anchor a horizontal placement puts the content on.
     *
     * @param hPlacement The placement to classify.
     * @returns `"before"` for `left-out`, `"after"` for `right-out`, `"over"` for the rest.
     */
    export const getHBandKind = (hPlacement: AnchorHPlacement): AnchorBandKind =>
        hPlacement === "left-out" ? "before" : hPlacement === "right-out" ? "after" : "over";

    /**
     * Which side of the anchor a vertical placement puts the content on.
     *
     * @param vPlacement The placement to classify.
     * @returns `"before"` for `top-out`, `"after"` for `bottom-out`, `"over"` for the rest.
     */
    export const getVBandKind = (vPlacement: AnchorVPlacement): AnchorBandKind =>
        vPlacement === "top-out" ? "before" : vPlacement === "bottom-out" ? "after" : "over";

    /**
     * Holds a position inside its band, giving up the far edge before the near one.
     *
     * The three kinds clamp differently on purpose. Content sitting before the anchor may be pushed
     * back towards the screen edge but must never be pushed past the anchor, so only its far end is
     * held; content after the anchor is the mirror of that; content over the anchor is held at both
     * ends. This is what keeps a menu that is taller than the screen still touching its button rather
     * than centering itself over it.
     *
     * @param start The position the placement asked for.
     * @param size The content's extent along this axis.
     * @param band The usable run from {@link AnchorUtils.getBand}.
     * @param kind The same kind that band was built for.
     * @returns The position to use.
     */
    export const clampToBand = (start: number, size: number, band: AnchorBand, kind: AnchorBandKind) => {
        if (kind === "before") return Math.min(start, band.end - size);
        if (kind === "after") return Math.max(start, band.start);

        return Math.max(band.start, Math.min(start, band.end - size));
    };

    /**
     * How much room a band offers.
     *
     * Useful as a maximum size for content that can scroll: a menu given a band of 200 pixels should
     * cap itself there rather than overflowing it.
     *
     * @param band The band to measure.
     * @returns Its extent, never negative.
     */
    export const getBandSize = (band: AnchorBand) => Math.max(0, band.end - band.start);

    /**
     * Picks the horizontal placement that spills off screen least.
     *
     * Each placement has a family of alternatives — chiefly its mirror image — and this tries them in
     * order and keeps the one with the smallest overflow. Flipping only happens when it helps, so the
     * placement the caller asked for is kept whenever it fits.
     *
     * @param hPlacement The placement the caller wants.
     * @param anchorRect The anchor, in screen coordinates.
     * @param contentSize The content's measured size.
     * @param screenSize The space available.
     * @param offsetSize The gap being held between anchor and content, if any.
     * @param reservedScreenSize A margin kept clear at both edges, if any.
     * @returns The placement to use, which may be the one asked for.
     */
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
                getHPlacementShift(candidate, anchorRect, contentSize) + getHPlacementOffset(candidate, offsetX),
                contentSize.width,
                screenSize.width,
                reservedW,
            );

        return H_FAMILIES[hPlacement].reduce((best, candidate) =>
            getCandidateOverflow(candidate) < getCandidateOverflow(best) ? candidate : best,
        );
    };

    /**
     * Picks the vertical placement that spills off screen least.
     *
     * @param vPlacement The placement the caller wants.
     * @param anchorRect The anchor, in screen coordinates.
     * @param contentSize The content's measured size.
     * @param screenSize The space available.
     * @param offsetSize The gap being held between anchor and content, if any.
     * @param reservedScreenSize A margin kept clear at both edges, if any.
     * @returns The placement to use, which may be the one asked for.
     */
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
                getVPlacementShift(candidate, anchorRect, contentSize) + getVPlacementOffset(candidate, offsetY),
                contentSize.height,
                screenSize.height,
                reservedH,
            );

        return V_FAMILIES[vPlacement].reduce((best, candidate) =>
            getCandidateOverflow(candidate) < getCandidateOverflow(best) ? candidate : best,
        );
    };

    /**
     * Reads the highest `z-index` written on an element or any of its ancestors.
     *
     * Content portaled out of the anchor's subtree leaves that stacking behind, so it has to be given
     * an index of its own to land above whatever the anchor was sitting under. This reads what the
     * document already says, as opposed to `ElevationUtils.getBase`, which reads what other
     * components have registered; a popup needs to clear both.
     *
     * @param element The anchor. Missing gives `0`.
     * @returns The highest index found, or `0` when nothing in the chain sets one.
     */
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

    /**
     * The placement portaled content should take: the one asked for, or its mirror where that fits better.
     *
     * @param placement The placement to aim for.
     * @param anchorRect The anchor, in viewport coordinates. Missing leaves the placement as asked.
     * @param contentSize The content's measured size. Missing leaves the placement as asked.
     * @param screenSize The viewport's size.
     * @param opts.offset The gap to hold between anchor and content.
     * @param opts.reservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.isPinned Keeps the placement asked for, for content that should run off screen rather than move.
     * @returns The placement to use.
     */
    export const computePortalPlacement = (
        placement: AnchorPlacement,
        anchorRect: Rect | undefined,
        contentSize: Size2d | undefined,
        screenSize: Size2d,
        opts?: { offset?: Point2d; reservedScreenSize?: Size2d; isPinned?: boolean },
    ): AnchorPlacement => {
        if (!contentSize || !anchorRect || opts?.isPinned) return placement;

        return {
            x: getSafeHPlacement(
                placement.x,
                anchorRect,
                contentSize,
                screenSize,
                opts?.offset,
                opts?.reservedScreenSize,
            ),
            y: getSafeVPlacement(
                placement.y,
                anchorRect,
                contentSize,
                screenSize,
                opts?.offset,
                opts?.reservedScreenSize,
            ),
        };
    };

    /**
     * Where portaled content goes for a placement, held inside the space that is actually free.
     *
     * @param placement The placement to use, as {@link computePortalPlacement} gives it.
     * @param anchorRect The anchor, in viewport coordinates.
     * @param contentSize The content's measured size.
     * @param screenSize The viewport's size.
     * @param opts.offset The gap to hold between anchor and content.
     * @param opts.reservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.isPinned Skips the clamping, for content that should run off screen rather than move.
     * @returns The content's top-left corner in viewport coordinates, or `undefined` until both the anchor and the
     * content have been measured.
     */
    export const computePortalPosition = (
        placement: AnchorPlacement,
        anchorRect: Rect | undefined,
        contentSize: Size2d | undefined,
        screenSize: Size2d,
        opts?: { offset?: Point2d; reservedScreenSize?: Size2d; isPinned?: boolean },
    ): Point2d | undefined => {
        if (!anchorRect || !contentSize) return;

        const x =
            getHPlacementShift(placement.x, anchorRect, contentSize) +
            getHPlacementOffset(placement.x, opts?.offset?.x ?? 0);
        const y =
            getVPlacementShift(placement.y, anchorRect, contentSize) +
            getVPlacementOffset(placement.y, opts?.offset?.y ?? 0);

        if (opts?.isPinned) return { x, y };

        const kinds = { x: getHBandKind(placement.x), y: getVBandKind(placement.y) };
        const reserved = opts?.reservedScreenSize;
        const bandX = getBand(
            kinds.x,
            anchorRect.x,
            anchorRect.width,
            opts?.offset?.x ?? 0,
            screenSize.width,
            reserved?.width ?? 0,
        );
        const bandY = getBand(
            kinds.y,
            anchorRect.y,
            anchorRect.height,
            opts?.offset?.y ?? 0,
            screenSize.height,
            reserved?.height ?? 0,
        );

        return {
            x: clampToBand(x, contentSize.width, bandX, kinds.x),
            y: clampToBand(y, contentSize.height, bandY, kinds.y),
        };
    };

    /**
     * Whether any part of an anchor is inside the viewport.
     *
     * @param anchorRect The anchor, in viewport coordinates. Missing counts as on screen.
     * @param screenSize The viewport's size.
     */
    export const getIsAnchorOnScreen = (anchorRect: Rect | undefined, screenSize: Size2d) => {
        if (!anchorRect) return true;

        return (
            anchorRect.x + anchorRect.width > 0 &&
            anchorRect.y + anchorRect.height > 0 &&
            anchorRect.x < screenSize.width &&
            anchorRect.y < screenSize.height
        );
    };

    /**
     * Watches portaled content's size as it lays out, until the returned function is called.
     *
     * Read as the element's offset size each time the browser reports a resize, the first report arriving once it
     * has been laid out.
     *
     * @param element The content's own element.
     * @param onSize Called with each size.
     * @returns The function that stops watching.
     */
    export const observeContentSize = (element: HTMLElement, onSize: (size: Size2d) => void) => {
        const observer = new ResizeObserver(() => {
            onSize({ width: element.offsetWidth, height: element.offsetHeight });
        });

        observer.observe(element);

        return () => observer.disconnect();
    };
}
