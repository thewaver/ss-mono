import { MathUtils } from "@thewaver/ss-utils";
import type { Size2d } from "@thewaver/ss-utils";

import type { CollapsibleSide } from "./Collapsible.types";

/** The heading elements a trigger may sit in, one per level. */
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/** The part of a disclosure that is not about drawing it: which way it opens, how far, and what it brings into view. */
export namespace CollapsibleUtils {
    /**
     * The heading element a trigger sits in for a heading level.
     *
     * A level outside one to six is held to the nearest end rather than refused, so a consumer nesting a collapsible
     * deeper than the page's outline goes still gets a heading.
     *
     * @param level The heading level, or `undefined` for no heading at all.
     * @returns The tag name, or `undefined` when there is no level.
     */
    export const getHeadingTag = (level: number | undefined) =>
        level === undefined ? undefined : HEADING_TAGS[MathUtils.clamp(level, 1, HEADING_TAGS.length) - 1];

    /**
     * Whether a panel opening on this side grows across rather than down.
     *
     * @param side The side of the trigger the panel opens on.
     * @returns `true` for left and right.
     */
    export const getIsSideways = (side: CollapsibleSide) => side === "left" || side === "right";

    /**
     * The dimension a panel opening on this side animates.
     *
     * @param side The side of the trigger the panel opens on.
     * @returns `"width"` for a sideways panel, `"height"` otherwise.
     */
    export const getPanelAxis = (side: CollapsibleSide) => (getIsSideways(side) ? "width" : "height");

    /**
     * Whether the panel's contents should be built.
     *
     * Once built they stay built, so closing a lazy panel does not discard what is inside it; until then they are
     * built up front unless the consumer asked to wait for the first open.
     *
     * @param hasContent Whether the contents were already built.
     * @param isPanelBuiltOnExpand Whether building waits for the first open.
     * @param isExpanded Whether the panel is open now.
     * @returns Whether the contents should be in the tree.
     */
    export const computeHasPanelContent = (
        hasContent: boolean,
        isPanelBuiltOnExpand: boolean | undefined,
        isExpanded: boolean,
    ) => hasContent || isPanelBuiltOnExpand !== true || isExpanded;

    /**
     * How far the panel is open, in pixels, along the axis it animates.
     *
     * @param visibilityTarget Where the fade is heading: `1` open, `0` shut.
     * @param contentSize The measured size of the panel's contents.
     * @param side The side of the trigger the panel opens on.
     * @returns The contents' own extent while opening or open, and `0` otherwise.
     */
    export const computePanelExtent = (visibilityTarget: 0 | 1, contentSize: Size2d, side: CollapsibleSide) => {
        if (visibilityTarget !== 1) return 0;

        return getIsSideways(side) ? contentSize.width : contentSize.height;
    };

    /**
     * Scrolls a disclosure into view, keeping its trigger in view over its far edge.
     *
     * The whole root is brought as near as it can be first, and then the trigger, so a panel taller than the space
     * it is scrolled into is cut at the far end rather than pushing the control that was pressed out of sight. It is
     * done once at once and again on the next frame, for a layout that is still settling.
     *
     * @param root The element holding the trigger and the panel.
     * @param trigger The control that opened it.
     * @returns The function that cancels the second pass.
     */
    export const scrollIntoView = (root: HTMLElement, trigger: HTMLElement) => {
        const scroll = () => {
            root.scrollIntoView({ block: "nearest" });
            trigger.scrollIntoView({ block: "nearest" });
        };

        scroll();

        const frameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(frameId);
    };
}
