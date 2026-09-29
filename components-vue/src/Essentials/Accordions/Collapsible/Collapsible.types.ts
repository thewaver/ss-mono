import type { AriaAttributes, VNodeChild } from "vue";

import type { CollapsibleFlags, CollapsibleSide, CollapsibleSizing, InteractionFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type CollapsiblePanelRenderer = (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;

export type CollapsibleTriggerProps = InteractionControlProps<CollapsibleFlags> & {
    /** Identifies the panel the trigger opens, so the trigger can point at it. */
    panelId: string;
    /** Whether the panel is open, so the trigger can say so and paint itself accordingly. */
    isExpanded: boolean;
    /** Runs when the trigger is activated, by pointer or by key. */
    onToggle: () => void;
};

export type CollapsibleProps = Omit<
    InteractionWrapperProps<CollapsibleFlags>,
    "extraFlags" | "sizing" | "minWidth" | "minHeight"
> & {
    /** Identifies the collapsible, and is what the trigger and panel compose their own ids from. */
    "id"?: string;
    /** Whether the collapsible takes only the room its content needs, or fills the width it is given. */
    "sizing"?: CollapsibleSizing;
    /**
     * Which side of the trigger the panel opens on. Top and bottom grow the panel's height, left and right its width;
     * a sideways panel keeps its contents at their own width and uncovers them, so give them one.
     */
    "side"?: CollapsibleSide;
    /** How long the panel takes to open and close. */
    "transitionDurationMs"?: number;
    /**
     * Which heading level the trigger sits at, so the page's outline stays correct wherever the collapsible is used.
     */
    "headingLevel"?: number;
    /**
     * Scrolls the panel into view once it has finished opening, for a panel that would otherwise open below the fold.
     */
    "isScrolledIntoViewOnExpand"?: boolean;
    /**
     * Builds the panel's contents only once it is first opened, rather than up front. It trades a cheaper first render
     * for a pause on that first open.
     */
    "isPanelBuiltOnExpand"?: boolean;
    /** The role the panel reports, where it is something other than a plain region. */
    "panelRole"?: string;
    /** ARIA attributes for the panel element. */
    "panelAriaAttributes"?: AriaAttributes;
    /**
     * Whether the panel is open. Both sides write it: the collapsible when its trigger is pressed, the consumer to open
     * or close it from outside. Leave it out and the collapsible keeps the state itself, starting closed.
     */
    "expanded"?: boolean;
    /** Receives the panel being opened or closed by its trigger, which is what `v-model:expanded` binds. */
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
};

export type CollapsibleSlots = Pick<InteractionWrapperSlots<CollapsibleFlags>, "renderDecoration"> & {
    /**
     * Draws the trigger. It is handed the interaction state so the trigger can answer to being hovered, pressed or
     * open.
     */
    renderTrigger: (flags: InteractionFlags<CollapsibleFlags>) => VNodeChild;
    /** Draws the panel body. */
    renderPanel: CollapsiblePanelRenderer;
};
