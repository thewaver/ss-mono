import type { SlideButtonCbs, SlideButtonRenderProps, SlideButtonState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SlideButtonElementProps = AccessorProps<
    SlideButtonCbs &
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
        }
>;

export type SlideButtonProps = Omit<InteractionWrapperProps<SlideButtonRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        SlideButtonCbs &
            Pick<InteractionControlProps<SlideButtonRenderProps>, "id" | "ariaLabel" | "renderContent"> &
            SlideButtonState & {
                /** How far the thumb has been slid. It is the only thing that moves it. */
                progressSignal?: SignalSource<number>;
            }
    >;
