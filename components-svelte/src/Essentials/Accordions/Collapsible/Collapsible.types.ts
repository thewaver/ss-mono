import type { Snippet } from "svelte";
import type { AriaAttributes, AriaRole } from "svelte/elements";

import type {
    BaseCollapsibleProps,
    CollapsibleFlags,
    CollapsibleSectionFlags,
    InteractionFlags,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type CollapsiblePanelRenderer = Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;

export type CollapsibleSectionRenderer = Snippet<[renderContent: Snippet, flags: CollapsibleSectionFlags]>;

export type CollapsibleTriggerProps = Omit<InteractionControlProps<CollapsibleFlags>, "renderContent"> & {
    /** Identifies the panel the trigger opens, so the trigger can point at it. */
    panelId: string;
    /** Whether the panel is open, so the trigger can say so and paint itself accordingly. */
    isExpanded: boolean;
    /**
     * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
     * open.
     */
    renderTrigger: Snippet<[flags: InteractionFlags<CollapsibleFlags>]>;
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
         * Whether the panel is open. Bind it with `bind:expanded`; both sides write it: the collapsible when its trigger is
         * pressed, the consumer to open or close it from outside. Leave it unbound and the collapsible keeps the state
         * itself, starting closed.
         */
        expanded?: boolean;
        /**
         * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
         * open.
         */
        renderTrigger: Snippet<[flags: InteractionFlags<CollapsibleFlags>]>;
        /** Draws the panel body. */
        renderPanel: CollapsiblePanelRenderer;
        /**
         * Draws a box around the trigger and the panel together, for a border, shadow or background that has to hold
         * both. Render `renderContent` inside it, or the collapsible draws nothing; where the panel sits beside the
         * trigger stays the collapsible's own layout. Left out, the pair is drawn with no box around it.
         */
        renderSection?: CollapsibleSectionRenderer;
    };
