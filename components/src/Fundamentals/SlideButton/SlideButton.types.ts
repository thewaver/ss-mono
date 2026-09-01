import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type SlideButtonRenderProps = {
    progressRatio: number;
    isDragging: boolean;
    isHolding: boolean;
};

export type SlideButtonCbs = {
    onActivate?: () => void | Promise<void>;
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type SlideButtonState = {
    thumbSize?: number;
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
            progressRatio: number;
            setProgressRatio: (ratio: number) => void;
            setIsDragging: (isDragging: boolean) => void;
            setIsHolding: (isHolding: boolean) => void;
        }
>;

export type SlideButtonProps = Omit<InteractionWrapperProps<SlideButtonRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        SlideButtonCbs &
            Pick<InteractionControlProps<SlideButtonRenderProps>, "id" | "ariaLabel" | "renderContent"> &
            SlideButtonState & {
                progressSignal?: SignalSource<number>;
            }
    >;
