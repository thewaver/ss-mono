import type { Snippet } from "svelte";
import type { InteractionFlags, PreviewFlags, PreviewSizing } from "@thewaver/ss-components";
import type { InteractionControlProps, InteractionWrapperProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
export type PreviewOverlayRenderer = Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
export type PreviewTriggerProps = Omit<InteractionControlProps<PreviewFlags>, "renderContent"> & {
    /** Identifies the content the trigger expands, so the trigger can point at it. */
    contentId: string;
    /** Whether the content is expanded, so the trigger can say so. */
    isExpanded: boolean;
    /** Draws the trigger. It is handed the interaction state, including whether the content is expanded. */
    renderTrigger: Snippet<[flags: InteractionFlags<PreviewFlags>]>;
    /** Runs when the trigger is activated. */
    onToggle: () => void;
};
export type PreviewProps = Omit<InteractionWrapperProps<PreviewFlags>, "renderControl" | "extraFlags" | "sizing" | "minWidth" | "minHeight"> & {
    /**
     * Identifies the preview's trigger. The content gets an id of its own, so this one names the control a consumer
     * labels.
     */
    id?: string;
    /** Whether the preview takes only the room its content needs, or fills the width it is given. */
    sizing?: PreviewSizing;
    /** How much of the content is shown while it is collapsed. */
    collapsedHeight: number;
    /**
     * Scrolls the preview back into view when it is collapsed, so the reader is not left further down the page than
     * they started.
     */
    isScrolledIntoViewOnCollapse?: boolean;
    /** How long the content takes to expand and collapse. */
    transitionDurationMs?: number;
    /**
     * Whether the content is expanded. Bind it with `bind:expanded`; both sides write it: the preview when its trigger
     * is pressed, the consumer to expand or collapse it from outside. Leave it unbound and the preview keeps the state
     * itself, starting collapsed.
     */
    expanded?: boolean;
    /** Draws the content being previewed. */
    renderContent: Snippet;
    /** Draws the trigger. */
    renderTrigger: Snippet<[flags: InteractionFlags<PreviewFlags>]>;
    /** Draws the fade over the cut-off edge of the collapsed content. */
    renderOverlay?: PreviewOverlayRenderer;
};
