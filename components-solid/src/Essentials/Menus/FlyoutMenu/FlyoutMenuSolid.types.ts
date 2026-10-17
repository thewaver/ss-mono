import type { Accessor, Component, JSX } from "solid-js";

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

import type { AccessorProps, AccessorValues } from "../../../Utils/typeUtils";
import type { TabLinkProps } from "../../Tabs/TabsSolid.types";

export type FlyoutMenuProps<T> = AccessorValues<BaseFlyoutMenuValues> &
    BaseFlyoutMenuCbs<T> &
    AccessorProps<{
        /** The bar's entries, in the order they are shown. */
        entries: FlyoutMenuEntryRecord<T>[];
        /** The component to draw every link with, for a site whose router draws its own links. A plain `<a>` otherwise. */
        linkComponent?: Component<TabLinkProps>;
    }> & {
        /** Draws a link's content, whether it is an entry on the bar or a link in a panel. */
        renderLink: (
            getLink: Accessor<FlyoutMenuLinkRecord<T>>,
            getFlags: () => InteractionFlags<FlyoutMenuLinkFlags>,
        ) => JSX.Element;
        /** Draws the content of an entry's toggle button, usually a chevron that turns as the panel opens. */
        renderToggle: (
            getEntry: Accessor<FlyoutMenuEntryRecord<T>>,
            getFlags: () => InteractionFlags<FlyoutMenuToggleFlags>,
        ) => JSX.Element;
        /**
         * Draws the content of the overflow entry's toggle button, which opens the panel holding the entries that did
         * not fit. Its text is its name, so it should say what it opens, such as "More".
         */
        renderOverflowToggle: (getFlags: () => InteractionFlags<FlyoutMenuToggleFlags>) => JSX.Element;
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
            renderLinks: () => JSX.Element,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
            getPlacement: () => AnchorPlacement,
            getSize: () => Size2d | undefined,
        ) => JSX.Element;
    };
