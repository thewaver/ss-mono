import type { Component, Snippet } from "svelte";

import type {
    AnchorPlacement,
    BaseFlyoutMenuCbs,
    BaseFlyoutMenuValues,
    FlyoutMenuEntryRecord,
    FlyoutMenuLinkFlags,
    FlyoutMenuLinkRecord,
    FlyoutMenuToggleFlags,
    HoverIntentDelayGroup,
    HoverIntentHandle,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { TabLinkProps } from "../../Tabs/Tabs.types.js";

export type FlyoutMenuRenderLink<T> = Snippet<
    [link: FlyoutMenuLinkRecord<T>, flags: InteractionFlags<FlyoutMenuLinkFlags>]
>;

export type FlyoutMenuRenderToggle<T> = Snippet<
    [entry: FlyoutMenuEntryRecord<T>, flags: InteractionFlags<FlyoutMenuToggleFlags>]
>;

export type FlyoutMenuLinkProps<T> = {
    /** The link this control stands for. */
    link: FlyoutMenuLinkRecord<T>;
    /** The component to draw the link with. A plain `<a>` otherwise. */
    linkComponent?: Component<TabLinkProps>;
    /** Draws the link's content. */
    renderLink: FlyoutMenuRenderLink<T>;
    /** Runs when the link is followed, which closes the panel. */
    onFollow: () => void;
};

export type FlyoutMenuLinkListProps<T> = Omit<FlyoutMenuLinkProps<T>, "link"> & {
    /** The links, in the order they are shown. */
    links: FlyoutMenuLinkRecord<T>[];
    /** Identifies the list, for the toggle button that opens it to point at. */
    id?: string;
};

export type FlyoutMenuToggleProps = {
    /** The button's element, for the bar to put focus back on. Bind it with `bind:ref`. */
    ref?: HTMLElement;
    /** Names the button, where its content does not already. */
    ariaLabel?: string;
    /** Identifies what the button opens, which it points at while that is open. */
    controlsId: string;
    /** Whether what the button opens is open. */
    isOpen: boolean;
    /** Runs when the button is pressed. */
    onPress: () => void;
    /** Runs for a key pressed on the button. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Draws the button's content. */
    renderContent: Snippet<[flags: InteractionFlags<FlyoutMenuToggleFlags>]>;
};

export type FlyoutMenuEntryProps<T> = Pick<FlyoutMenuLinkProps<T>, "linkComponent" | "renderLink" | "onFollow"> &
    Pick<BaseFlyoutMenuCbs<T>, "computeToggleLabel"> & {
        /** The entry's element, which is measured and which the panel is anchored to. Bind it with `bind:ref`. */
        ref?: HTMLElement;
        /** The entry's toggle button, for the bar to put focus back on. Bind it with `bind:toggleRef`. */
        toggleRef?: HTMLElement;
        /** The entry itself. */
        entry: FlyoutMenuEntryRecord<T>;
        /** Where the entry sits among the bar's entries. */
        index: number;
        /** Whether the entry is on the bar rather than collapsed, and so whether it is drawn and hovered at all. */
        isShown: boolean;
        /** Whether the entry's panel is open. */
        isOpen: boolean;
        /** Identifies the panel, which the toggle button points at while it is open. */
        panelId: string;
        /** The panel's element, whose hover keeps it open while it is this entry's. */
        panelRef: HTMLElement | undefined;
        /** The family of hovers whose skip window the entry shares with the rest of the bar. */
        delayGroup: HoverIntentDelayGroup;
        /** How long the pointer has to rest on the entry before its panel opens. */
        hoverShowDelayMs: number;
        /** How soon after a panel has closed a hover opens one again at once. */
        skipDelayWindowMs: number;
        /** Whether the panel is held open although the pointer has left it, which focus inside it does. */
        getIsHeld: () => boolean;
        /** Draws the content of the entry's toggle button. */
        renderToggle: FlyoutMenuRenderToggle<T>;
        /** Runs when a hover opens or closes the entry's panel. */
        onHoverChange: (index: number, isOpen: boolean) => void;
        /** Runs when the entry's toggle button is pressed. */
        onToggle: (index: number) => void;
        /** Runs for a key pressed on the entry's toggle button. */
        onToggleKeyDown: (index: number, e: KeyboardEvent) => void;
        /** Hands the bar the entry's hover as it starts, so it can cancel it, and returns the call that forgets it. */
        recordHoverIntent: (index: number, handle: HoverIntentHandle) => () => void;
    };

export type FlyoutMenuCollapsedEntryProps<T> = Pick<
    FlyoutMenuLinkProps<T>,
    "linkComponent" | "renderLink" | "onFollow"
> &
    Pick<BaseFlyoutMenuCbs<T>, "computeToggleLabel"> & {
        /** The entry itself. */
        entry: FlyoutMenuEntryRecord<T>;
        /** Whether the entry's links are opened in place. */
        isExpanded: boolean;
        /** Draws the content of the entry's toggle button. */
        renderToggle: FlyoutMenuRenderToggle<T>;
        /** Runs when the entry's toggle button is pressed, to open or close its links in place. */
        onToggleExpanded: (value: T) => void;
    };

export type FlyoutMenuProps<T> = BaseFlyoutMenuValues &
    BaseFlyoutMenuCbs<T> & {
        /** The bar's entries, in the order they are shown. */
        entries: FlyoutMenuEntryRecord<T>[];
        /**
         * The component to draw every link with, for a site whose router draws its own links. A plain `<a>` otherwise.
         */
        linkComponent?: Component<TabLinkProps>;
        /** Draws a link's content, whether it is an entry on the bar or a link in a panel. */
        renderLink: FlyoutMenuRenderLink<T>;
        /** Draws the content of an entry's toggle button, usually a chevron that turns as the panel opens. */
        renderToggle: FlyoutMenuRenderToggle<T>;
        /**
         * Draws the content of the overflow entry's toggle button, which opens the panel holding the entries that did
         * not fit. Its text is its name, so it should say what it opens, such as "More".
         */
        renderOverflowToggle: Snippet<[flags: InteractionFlags<FlyoutMenuToggleFlags>]>;
        /**
         * Draws the panel around its links. The fade is handed in rather than applied, so the consumer decides what
         * fading looks like; the placement comes with it for a caller that wants to point an arrow at the entry.
         *
         * The size is the links' own, measured at their natural width, and `undefined` until it has been measured.
         * The panel's look is the consumer's, so the library cannot resize it: to have the panel grow and shrink
         * smoothly as it glides between entries of different sizes, give the box around `renderLinks` this width and
         * height, a transition on both, and `overflow: hidden`. Before the first measure the box is left at its natural
         * size, so a panel opening does not grow out of nothing.
         */
        renderPanel: Snippet<
            [
                renderLinks: Snippet,
                visibilityTarget: 0 | 1,
                transitionDurationMs: number,
                placement: AnchorPlacement,
                size: Size2d | undefined,
            ]
        >;
    };
