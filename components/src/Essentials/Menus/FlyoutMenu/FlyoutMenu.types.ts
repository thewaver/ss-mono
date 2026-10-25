import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { OverflowCollapse } from "../../../Abstracts/Overflow/Overflow.types";

export type FlyoutMenuLinkRecord<T> = {
    /** Identifies the link, and is what the consumer's painter draws it from. */
    value: T;
    /** The page the link goes to. */
    href: string;
    /** Marks the link as the page being shown, which a screen reader announces as the current page. */
    isCurrent?: boolean;
};

export type FlyoutMenuEntryRecord<T> = FlyoutMenuLinkRecord<T> & {
    /**
     * The links the entry's panel holds. An entry with none is a plain link with no toggle button and nothing to open.
     */
    links?: FlyoutMenuLinkRecord<T>[];
    /**
     * Whether the entry may collapse into the overflow panel when the bar runs out of room: `"auto"` to let it fit if
     * it can, `"never"` to always show it, `"always"` to always collapse it.
     */
    collapse?: OverflowCollapse;
};

/** What a link's painter is told beyond the interaction flags. */
export type FlyoutMenuLinkFlags = {
    /** Whether the link is the page being shown. */
    isCurrent: boolean;
};

/** What a toggle button's painter is told beyond the interaction flags. */
export type FlyoutMenuToggleFlags = {
    /** Whether the panel the button controls is open. */
    isOpen: boolean;
};

export type BaseFlyoutMenuValues = {
    /**
     * Names the navigation landmark, so a page with more than one can tell them apart. Required, since a site's bar is
     * rarely the page's only navigation.
     */
    ariaLabel: string;
    /** The space between entries. */
    gap?: number;
    /**
     * Where the panel sits against the entry that opened it, as one choice across and one down. A placement that will
     * not fit falls back within its own family. Left out, it hangs below the entry lined up with the edge the text
     * starts from: the left, or the right where the menu sits in right-to-left text. Given, it is used as it stands
     * in either direction.
     */
    placement?: AnchorPlacement;
    /**
     * How far the panel is held clear of its entry, in pixels. The strip this opens is bridged, so the pointer can
     * cross it to reach the panel without losing it.
     */
    offset?: Point2d;
    /** How long the panel takes to fade in and out, and to glide from one entry to the next. */
    transitionDurationMs?: number;
    /** How long the highlight's marker takes to slide from one entry or link to the next, and to fade. */
    floaterTransitionDurationMs?: number;
    /**
     * How long the pointer has to rest on an entry before its panel opens, so sweeping across the bar does not open a
     * panel per entry. Set it to `0` to open on hover at once.
     */
    hoverShowDelayMs?: number;
    /**
     * How soon after a panel has closed a hover opens one again at once, without waiting out `hoverShowDelayMs`. It is
     * what lets the pointer move from one entry to the next with the panel following rather than closing and reopening.
     */
    skipDelayWindowMs?: number;
};

export type BaseFlyoutMenuCbs<T> = {
    /**
     * Names an entry's toggle button. The button usually draws only a chevron, so the name is what a screen reader
     * hears; the convention is the entry's own name, such as "Clothing submenu".
     */
    computeToggleLabel: (value: T) => string;
};

export type BaseFlyoutMenuProps<T> = BaseFlyoutMenuValues & BaseFlyoutMenuCbs<T>;
