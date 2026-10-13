import type { JSX } from "solid-js";

import type { BasePreviewValues, InteractionFlags, PreviewFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type PreviewOverlayRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type PreviewTriggerProps = AccessorProps<
    Omit<InteractionControlProps<PreviewFlags>, "renderContent" | "id"> & {
        /** Identifies the content the trigger expands, so the trigger can point at it. */
        contentId: string;
        /** Whether the content is expanded, so the trigger can say so. */
        isExpanded: boolean;
        /** Draws the trigger. It is handed the interaction state, including whether the content is expanded. */
        renderTrigger: (getFlags: () => InteractionFlags<PreviewFlags>) => JSX.Element;
        /** Runs when the trigger is activated. */
        onToggle: () => void;
        /** Identifies the trigger, so a label elsewhere can point at it. */
        id?: string;
    }
>;

export type PreviewProps = Omit<
    InteractionWrapperProps<PreviewFlags>,
    "renderControl" | "extraFlags" | "sizing" | "minWidth" | "minHeight"
> &
    AccessorValues<BasePreviewValues> &
    AccessorProps<{
        /**
         * Whether the content is expanded. Both sides write it: the preview when its trigger is pressed, the consumer to
         * expand or collapse it from outside. Leave it out and the preview keeps the state itself, starting collapsed.
         */
        expanded?: SignalSource<boolean>;
        /** Draws the content being previewed. */
        renderContent: () => JSX.Element;
        /** Draws the trigger. */
        renderTrigger: (getFlags: () => InteractionFlags<PreviewFlags>) => JSX.Element;
        /** Draws the fade over the cut-off edge of the collapsed content. */
        renderOverlay?: PreviewOverlayRenderer;
    }>;
