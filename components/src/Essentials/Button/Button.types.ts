import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type ButtonType = "button" | "submit" | "reset";

export type ButtonFlags = {
    /**
     * Whether the promise the last press's `onClick` answered with is still running. The button is announced
     * as busy and refuses further presses until it settles — `onClick`, the pointer callbacks and the wrapper's
     * `onActivation` stay silent, as they do while disabled — but it is not disabled, so it keeps its focus and
     * its place in the tab order.
     */
    isPending: boolean;
};

export type ButtonCbs = {
    /**
     * Runs when the button is activated. It is given the event so a consumer can tell a click from the
     * keyboard activation that Enter and Space also produce. Answer with a promise and the button stays
     * pending until it settles, ignoring any press in the meantime; a rejection is not caught.
     */
    onClick?: (e: MouseEvent | KeyboardEvent) => void | Promise<void>;
    /** Runs as the press goes down, before it is known whether it will become an activation. */
    onPointerDown?: (e: PointerEvent) => void;
    /** Runs as the press comes back up, whether or not it activated the button. */
    onPointerUp?: (e: PointerEvent) => void;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type ButtonElementProps = AccessorProps<
    ButtonCbs &
        InteractionControlProps<ButtonFlags> & {
            /** What the button does inside a form: nothing, submit it, or reset it. */
            type?: ButtonType;
        }
>;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ButtonCbs &
            Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent"> & {
                /**
                 * What the button does inside a form. It defaults to doing nothing, so a button in a form
                 * does not submit it by accident. A disabled or pending button neither submits nor resets.
                 */
                type?: ButtonType;
            }
    >;
