import type { VNodeChild } from "vue";

import type { BasePreviewProps, InteractionFlags, PreviewFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type PreviewOverlayRenderer = (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;

export type PreviewTriggerProps = InteractionControlProps<PreviewFlags> & {
    /** Identifies the content the trigger expands, so the trigger can point at it. */
    contentId: string;
    /** Whether the content is expanded, so the trigger can say so. */
    isExpanded: boolean;
    /** Runs when the trigger is activated. */
    onToggle: () => void;
};

export type PreviewProps = Omit<
    InteractionWrapperProps<PreviewFlags>,
    "extraFlags" | "sizing" | "minWidth" | "minHeight"
> &
    BasePreviewProps & {
        /**
         * Whether the content is expanded. Both sides write it: the preview when its trigger is pressed, the consumer to
         * expand or collapse it from outside. Leave it out and the preview keeps the state itself, starting collapsed.
         */
        "expanded"?: boolean;
        /** Receives the content being expanded or collapsed by its trigger, which is what `v-model:expanded` binds. */
        "onUpdate:expanded"?: (isExpanded: boolean) => void;
    };

export type PreviewSlots = Pick<InteractionWrapperSlots<PreviewFlags>, "renderDecoration"> & {
    /** Draws the content being previewed. */
    renderContent: () => VNodeChild;
    /** Draws the trigger. */
    renderTrigger: (flags: InteractionFlags<PreviewFlags>) => VNodeChild;
    /** Draws the fade over the cut-off edge of the collapsed content. */
    renderOverlay?: PreviewOverlayRenderer;
};
