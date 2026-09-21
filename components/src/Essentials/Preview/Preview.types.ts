import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type PreviewSizing = "fit-content" | "fill";

export type PreviewFlags = {
    isExpanded: boolean;
};

export type PreviewOverlayRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type PreviewTriggerProps = AccessorProps<
    Omit<InteractionControlProps<PreviewFlags>, "renderContent"> & {
        /** Identifies the content the trigger expands, so the trigger can point at it. */
        contentId: string;
        /** Whether the content is expanded, so the trigger can say so. */
        isExpanded: boolean;
        /** Draws the trigger. It is handed the interaction state, including whether the content is expanded. */
        renderTrigger: (getFlags: () => InteractionFlags<PreviewFlags>) => JSX.Element;
        /** Runs when the trigger is activated. */
        onToggle: () => void;
    }
>;

export type PreviewProps = Omit<
    InteractionWrapperProps<PreviewFlags>,
    "renderControl" | "extraFlags" | "sizing" | "minWidth" | "minHeight"
> &
    AccessorProps<{
        /** Identifies the preview's trigger. The content gets an id of its own, so this one names the control a consumer labels. */
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
        /** Whether the content is expanded. It is the only thing that expands or collapses it. */
        expandedSignal: SignalSource<boolean>;
        /** Draws the content being previewed. */
        renderContent: () => JSX.Element;
        /** Draws the trigger. */
        renderTrigger: (getFlags: () => InteractionFlags<PreviewFlags>) => JSX.Element;
        /** Draws the fade over the cut-off edge of the collapsed content. */
        renderOverlay?: PreviewOverlayRenderer;
    }>;
