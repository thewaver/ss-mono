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

export type SlideButtonMode = "slide" | "hold" | "both";

export type SlideButtonState = {
    /** How large the thumb is. The track reserves room for it so the far end stays reachable. */
    thumbSize?: number;
    /**
     * How long the button has to be held to confirm without sliding, which is the keyboard and assistive route to the
     * same action. It times a held Enter or Space under every mode, and a held pointer under all but `"slide"`.
     */
    holdDurationMs?: number;
    /**
     * Which pointer gestures reach the action: dragging the thumb along the track, pressing and holding, or both.
     * Defaults to `"both"`, which is the conformant configuration and the one to stay on without a reason to move.
     *
     * **It governs the pointer and nothing else.** A held Enter or Space confirms under every mode, so no setting
     * here can leave the button unoperable from a keyboard, and WCAG 2.1.1 is safe throughout.
     *
     * **`"slide"` requires both halves of the gesture**: the press has to land on the thumb, and it then has to
     * travel far enough to count as a drag rather than a wobble. A press that meets one and not the other does
     * nothing, which is the whole point of the setting — a stray press anywhere on the control is refused.
     *
     * **It also gives up the pointer route that WCAG 2.5.7 Dragging Movements asks for.** That criterion, Level AA,
     * wants anything operable by dragging to also be operable by a single pointer without dragging, and the hold
     * is what answers it — a keyboard route does not, since 2.5.7 is about pointers. The default answers it, so
     * the library ships a working path; a consumer choosing `"slide"` is choosing to give that path up, and it is
     * theirs to replace elsewhere on the page. `"hold"` gives up nothing: it removes the drag, which no criterion
     * requires.
     */
    mode?: SlideButtonMode;
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
