import type { AriaAttributes, AriaRole, ReactNode } from "react";

import type { BaseCollapsibleProps, CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type CollapsiblePanelRenderer = (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;

export type CollapsibleTriggerProps = Omit<InteractionControlProps<CollapsibleFlags>, "renderContent"> & {
    /** Identifies the panel the trigger opens, so the trigger can point at it. */
    panelId: string;
    /** Whether the panel is open, so the trigger can say so and paint itself accordingly. */
    isExpanded: boolean;
    /**
     * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
     * open.
     */
    renderTrigger: (flags: InteractionFlags<CollapsibleFlags>) => ReactNode;
    /** Runs when the trigger is activated, by pointer or by key. */
    onToggle: () => void;
};

export type CollapsibleProps = Omit<
    InteractionWrapperProps<CollapsibleFlags>,
    "renderControl" | "extraFlags" | "sizing" | "minWidth" | "minHeight"
> &
    BaseCollapsibleProps & {
        /** The role the panel reports, where it is something other than a plain region. */
        panelRole?: AriaRole;
        /** ARIA attributes for the panel element. */
        panelAriaAttributes?: AriaAttributes;
        /**
         * Whether the panel is open, with its setter. Both sides write it: the collapsible when its trigger is pressed, the
         * consumer to open or close it from outside. Leave it out and the collapsible keeps the state itself, starting
         * closed.
         */
        expanded?: readonly [boolean, (isExpanded: boolean) => void];
        /**
         * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
         * open.
         */
        renderTrigger: (flags: InteractionFlags<CollapsibleFlags>) => ReactNode;
        /** Draws the panel body. */
        renderPanel: CollapsiblePanelRenderer;
    };
