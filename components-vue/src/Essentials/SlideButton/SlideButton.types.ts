import type { SlideButtonCbs, SlideButtonRenderProps, SlideButtonState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { SlideButtonCbs };

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

export type SlideButtonProps = Omit<InteractionWrapperProps<SlideButtonRenderProps>, "extraFlags"> &
    SlideButtonCbs &
    Pick<InteractionControlProps<SlideButtonRenderProps>, "id" | "ariaLabel"> &
    SlideButtonState & {
        /**
         * How far the thumb has been slid, as a share of its travel. It is the only thing that moves it, and it is
         * written on every frame of a slide or a hold, so an owner can show the progress outside the button. Leave it
         * out and the button holds its own, starting at rest.
         */
        "progress"?: number;
        /** Receives the progress on every frame of a slide or a hold, which is what `v-model:progress` binds. */
        "onUpdate:progress"?: (ratio: number) => void;
    };

export type SlideButtonSlots = Pick<InteractionWrapperSlots<SlideButtonRenderProps>, "renderDecoration"> &
    InteractionControlSlots<SlideButtonRenderProps>;
