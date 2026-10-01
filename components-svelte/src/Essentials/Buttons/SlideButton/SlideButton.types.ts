import type { SlideButtonRenderProps, SlideButtonState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type SlideButtonCbs = {
    /** Runs once the slide or the hold has been completed. */
    onActivate?: () => void;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type SlideButtonElementProps = SlideButtonCbs &
    InteractionControlProps<SlideButtonRenderProps> &
    Required<SlideButtonState> & {
        /** How far the thumb has been slid, as a share of its travel. */
        progressRatio: number;
        /** Moves the thumb to a share of its travel. */
        setProgressRatio: (ratio: number) => void;
        /** Says whether the thumb is being dragged. */
        setIsDragging: (isDragging: boolean) => void;
        /** Says whether the button is being held. */
        setIsHolding: (isHolding: boolean) => void;
    };

export type SlideButtonProps = Omit<InteractionWrapperProps<SlideButtonRenderProps>, "renderControl" | "extraFlags"> &
    SlideButtonCbs &
    Pick<InteractionControlProps<SlideButtonRenderProps>, "id" | "ariaLabel" | "renderContent"> &
    SlideButtonState & {
        /**
         * How far the thumb has been slid, as a share of its travel. Bind it with `bind:progress`; it is the only thing
         * that moves it, and it is written on every frame of a slide or a hold, so an owner can show the progress
         * outside the button. Leave it out and the button holds its own, starting at rest.
         */
        progress?: number;
    };
