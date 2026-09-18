import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SlideButtonRenderProps = {
    /** How far the thumb has been slid, as a share of its travel. */
    progressRatio: number;
    /** Whether the thumb is being dragged right now. */
    isDragging: boolean;
    /** Whether the button is being held down, for the hold-to-confirm route. */
    isHolding: boolean;
};

export type SlideButtonCbs = {
    /** Runs once the slide or the hold has been completed. */
    onActivate?: () => void | Promise<void>;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type SlideButtonState = {
    /** How large the thumb is. The track reserves room for it so the far end stays reachable. */
    thumbSize?: number;
    /**
     * How long the button has to be held to confirm without sliding, which is the keyboard and assistive route to the
     * same action.
     */
    holdDurationMs?: number;
};

export type SlideButtonPress = {
    ratio: number;
    isOnThumb: boolean;
};

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
