import type { JSX } from "solid-js";

import type {
    BaseCollapsibleValues,
    CollapsibleFlags,
    CollapsibleSectionFlags,
    InteractionFlags,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CollapsiblePanelRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type CollapsibleSectionRenderer = (
    renderContent: () => JSX.Element,
    getFlags: () => CollapsibleSectionFlags,
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
    AccessorValues<BaseCollapsibleValues> &
    AccessorProps<{
        /** The role the panel reports, where it is something other than a plain region. */
        panelRole?: JSX.HTMLAttributes<HTMLElement>["role"];
        /** ARIA attributes for the panel element. */
        panelAriaAttributes?: JSX.AriaAttributes;
        /**
         * Whether the panel is open. Both sides write it: the collapsible when its trigger is pressed, the consumer to
         * open or close it from outside. Leave it out and the collapsible keeps the state itself, starting closed.
         */
        expanded?: SignalSource<boolean>;
        /**
         * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
         * open.
         */
        renderTrigger: (getFlags: () => InteractionFlags<CollapsibleFlags>) => JSX.Element;
        /** Draws the panel body. */
        renderPanel: CollapsiblePanelRenderer;
        /**
         * Draws a box around the trigger and the panel together, for a border, shadow or background that has to hold
         * both. Call `renderContent` inside it, or the collapsible draws nothing; where the panel sits beside the
         * trigger stays the collapsible's own layout. Left out, the pair is drawn with no box around it.
         */
        renderSection?: CollapsibleSectionRenderer;
    }>;
