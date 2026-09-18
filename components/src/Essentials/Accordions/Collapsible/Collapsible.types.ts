import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type CollapsibleSizing = "fit-content" | "fill";

export type CollapsibleFlags = {
    isExpanded: boolean;
};

export type CollapsiblePanelRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type CollapsibleTriggerProps = AccessorProps<
    Omit<InteractionControlProps<CollapsibleFlags>, "renderContent"> & {
        /** Identifies the panel the trigger opens, so the trigger can point at it. */
        panelId: string;
        /** Whether the panel is open, so the trigger can say so and paint itself accordingly. */
        isExpanded: boolean;
        /**
         * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
         * open.
         */
        renderTrigger: (getFlags: () => InteractionFlags<CollapsibleFlags>) => JSX.Element;
        /** Runs when the trigger is activated, by pointer or by key. */
        onToggle: () => void;
    }
>;

export type CollapsibleProps = Omit<
    InteractionWrapperProps<CollapsibleFlags>,
    "renderControl" | "extraFlags" | "sizing" | "minWidth" | "minHeight"
> &
    AccessorProps<{
        /** Identifies the collapsible, and is what the trigger and panel compose their own ids from. */
        id?: string;
        /**
         * Whether the panel animates its height open and closed or simply appears, which is the trade between a smooth
         * open and never measuring the content.
         */
        sizing?: CollapsibleSizing;
        /** How long the panel takes to open and close. */
        transitionDurationMs?: number;
        /**
         * Which heading level the trigger sits at, so the page's outline stays correct wherever the collapsible is
         * used.
         */
        headingLevel?: number;
        /**
         * Scrolls the panel into view once it has finished opening, for a panel that would otherwise open below the
         * fold.
         */
        isScrolledIntoViewOnExpand?: boolean;
        /**
         * Builds the panel's contents only once it is first opened, rather than up front. It trades a cheaper first
         * render for a pause on that first open.
         */
        isPanelBuiltOnExpand?: boolean;
        /** The role the panel reports, where it is something other than a plain region. */
        panelRole?: JSX.HTMLAttributes<HTMLElement>["role"];
        /** ARIA attributes for the panel element. */
        panelAriaAttributes?: JSX.AriaAttributes;
        /** Whether the panel is open. It is the only thing that opens or closes it. */
        expandedSignal: SignalSource<boolean>;
        /**
         * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
         * open.
         */
        renderTrigger: (getFlags: () => InteractionFlags<CollapsibleFlags>) => JSX.Element;
        /** Draws the panel body. */
        renderPanel: CollapsiblePanelRenderer;
    }>;
