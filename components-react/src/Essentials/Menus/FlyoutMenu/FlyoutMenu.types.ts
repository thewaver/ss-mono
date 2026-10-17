import type { ComponentType, ReactNode } from "react";

import type {
    AnchorPlacement,
    BaseFlyoutMenuProps,
    FlyoutMenuEntryRecord,
    FlyoutMenuLinkFlags,
    FlyoutMenuLinkRecord,
    FlyoutMenuToggleFlags,
    HoverIntentDelayGroup,
    HoverIntentHandle,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { TabLinkProps } from "../../Tabs/Tabs.types";

export type FlyoutMenuEntryProps = {
    /**
     * Where the entry sits on the bar, or `FlyoutMenuUtils.OVERFLOW_INDEX` for the overflow entry. It is what the
     * entry's hover intent is filed under.
     */
    index: number;
    /** Whether the entry sits on the bar, rather than being kept out of sight only to be measured. */
    isShown: boolean;
    /** The element whose hover opens the entry's panel, or `undefined` while hovering it should open nothing. */
    anchor: HTMLElement | undefined;
    /** The panel every entry shares, or `null` while it is not mounted. */
    panel: HTMLElement | null;
    /** Whether the shared panel is open on this entry. */
    isOpen: boolean;
    /** The family whose skip window every entry of the bar shares. */
    delayGroup: HoverIntentDelayGroup;
    /** How long the pointer has to rest on the entry before its panel opens. */
    hoverShowDelayMs: number;
    /** How soon after a panel has closed a hover opens one again at once. */
    skipDelayWindowMs: number;
    /** Where the entry files its hover intent, so the bar can cancel a pending open or ask where the pointer is. */
    hoverIntents: Map<number, HoverIntentHandle>;
    /** Receives the entry's element, which the bar measures and anchors the panel to. */
    ref: (element: HTMLElement | null) => void;
    /** What the entry holds. */
    children: ReactNode;
    /** Runs when a hover opens or closes the entry's panel. */
    onOpenChange: (isOpen: boolean) => void;
};

export type FlyoutMenuProps<T> = BaseFlyoutMenuProps<T> & {
    /** The bar's entries, in the order they are shown. */
    entries: FlyoutMenuEntryRecord<T>[];
    /** The component to draw every link with, for a site whose router draws its own links. A plain `<a>` otherwise. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Draws a link's content, whether it is an entry on the bar or a link in a panel. */
    renderLink: (link: FlyoutMenuLinkRecord<T>, flags: InteractionFlags<FlyoutMenuLinkFlags>) => ReactNode;
    /** Draws the content of an entry's toggle button, usually a chevron that turns as the panel opens. */
    renderToggle: (entry: FlyoutMenuEntryRecord<T>, flags: InteractionFlags<FlyoutMenuToggleFlags>) => ReactNode;
    /**
     * Draws the content of the overflow entry's toggle button, which opens the panel holding the entries that did
     * not fit. Its text is its name, so it should say what it opens, such as "More".
     */
    renderOverflowToggle: (flags: InteractionFlags<FlyoutMenuToggleFlags>) => ReactNode;
    /**
     * Draws the panel around its links. The fade is handed in rather than applied, so the consumer decides what
     * fading looks like; the placement comes with it for a caller that wants to point an arrow at the entry.
     *
     * The size is the links' own, measured at their natural width, and `undefined` until it has been measured. The
     * panel's look is the consumer's, so the library cannot resize it: to have the panel grow and shrink smoothly as
     * it glides between entries of different sizes, give the box around `renderLinks` this width and height, a
     * transition on both, and `overflow: hidden`. Before the first measure the box is left at its natural size, so
     * a panel opening does not grow out of nothing.
     */
    renderPanel: (
        renderLinks: () => ReactNode,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        placement: AnchorPlacement,
        size: Size2d | undefined,
    ) => ReactNode;
};
