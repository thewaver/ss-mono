import type { Component, VNodeChild } from "vue";

import type {
    AnchorPlacement,
    BaseFlyoutMenuCbs,
    BaseFlyoutMenuValues,
    FlyoutMenuEntryRecord,
    FlyoutMenuLinkFlags,
    FlyoutMenuLinkRecord,
    FlyoutMenuToggleFlags,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { TabLinkProps } from "../../Tabs/Tabs.types";

export type FlyoutMenuProps<T> = BaseFlyoutMenuValues &
    BaseFlyoutMenuCbs<T> & {
        /** The bar's entries, in the order they are shown. */
        entries: FlyoutMenuEntryRecord<T>[];
        /** The component to draw every link with, for a site whose router draws its own links. A plain `<a>` otherwise. */
        linkComponent?: Component<TabLinkProps>;
    };

export type FlyoutMenuSlots<T> = {
    /** Draws a link's content, whether it is an entry on the bar or a link in a panel. */
    renderLink: (props: { link: FlyoutMenuLinkRecord<T>; flags: InteractionFlags<FlyoutMenuLinkFlags> }) => VNodeChild;
    /** Draws the content of an entry's toggle button, usually a chevron that turns as the panel opens. */
    renderToggle: (props: {
        entry: FlyoutMenuEntryRecord<T>;
        flags: InteractionFlags<FlyoutMenuToggleFlags>;
    }) => VNodeChild;
    /**
     * Draws the content of the overflow entry's toggle button, which opens the panel holding the entries that did not
     * fit. Its text is its name, so it should say what it opens, such as "More".
     */
    renderOverflowToggle: (flags: InteractionFlags<FlyoutMenuToggleFlags>) => VNodeChild;
    /**
     * Draws the marker that slides behind the highlighted item: on the bar, the hovered entry, else the one whose
     * panel is open, else the one keyboard focus is on; in the panel, the hovered link, else the focused one. An
     * entry's link and toggle sit under one marker, so they light up as one. Called once for the bar and once for the
     * panel. Leave it out and no marker is drawn.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the panel around its links. The fade is handed in rather than applied, so the consumer decides what
     * fading looks like; the placement comes with it for a caller that wants to point an arrow at the entry.
     *
     * The size is the links' own, measured at their natural width, and `undefined` until it has been measured. The
     * panel's look is the consumer's, so the library cannot resize it: to have the panel grow and shrink smoothly as it
     * glides between entries of different sizes, give the box around `renderLinks` this width and height, a transition
     * on both, and `overflow: hidden`. Before the first measure the box is left at its natural size, so a panel opening
     * does not grow out of nothing.
     */
    renderPanel: (props: {
        renderLinks: () => VNodeChild;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
        size: Size2d | undefined;
    }) => VNodeChild;
};
