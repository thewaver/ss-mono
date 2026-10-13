import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import type {
    BaseTabPanelValues,
    BaseTabsCbs,
    BaseTabsValues,
    InteractionFlags,
    PlacementRect,
    Tab,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";

export type TabLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type TabPanelProps = ParentProps<AccessorValues<BaseTabPanelValues>>;

export type TabsItemProps<T> = AccessorProps<
    Omit<InteractionControlProps, "id"> & {
        /** Whether this tab is the selected one, so it can paint itself accordingly. */
        isSelected: boolean;
        /** The component to draw a routed tab with, for a tab that navigates rather than switching in place. */
        linkComponent?: Component<TabLinkProps>;
    }
> & {
    /** The tab this item stands for. */
    tab: MaybeAccessor<Tab<T>>;
    /** Runs when this tab is chosen. */
    onSelect: (value: T) => void;
};

export type TabsProps<T> = AccessorValues<BaseTabsValues<T>> &
    BaseTabsCbs<T> &
    AccessorProps<{
        /** The component to draw routed tabs with, for tabs that navigate rather than switching in place. */
        linkComponent?: Component<TabLinkProps>;
        /** Draws the rail the tabs sit against. */
        renderGutter?: () => JSX.Element;
        /**
         * Draws the marker that slides to the selected tab, behind it. The fade is handed in rather than applied: the
         * marker fades out when nothing is selected and in when something is.
         */
        renderSelectionFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /**
         * Draws the marker that slides to the tab under the pointer, or the one holding focus, behind it — a hover pill
         * gliding along the strip. It fades out when neither is on a tab. Drawn under the selection's marker where both
         * are given.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }> & {
        /**
         * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
         * than in a row.
         */
        renderTab: (
            getTab: Accessor<Tab<T>>,
            getFlags: () => InteractionFlags,
            getPlacement: () => PlacementRect | undefined,
        ) => JSX.Element;
    };
