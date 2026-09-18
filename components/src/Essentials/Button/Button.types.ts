import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type ButtonType = "button" | "submit" | "reset";

export type ButtonCbs = {
    /**
     * Runs when the button is activated. It is given the event so a consumer can tell a click from the
     * keyboard activation that Enter and Space also produce.
     */
    onClick?: (e: MouseEvent | KeyboardEvent) => void | Promise<void>;
    /** Runs as the press goes down, before it is known whether it will become an activation. */
    onPointerDown?: (e: PointerEvent) => void | Promise<void>;
    /** Runs as the press comes back up, whether or not it activated the button. */
    onPointerUp?: (e: PointerEvent) => void | Promise<void>;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type ButtonElementProps = AccessorProps<
    ButtonCbs &
        InteractionControlProps & {
            /** What the button does inside a form: nothing, submit it, or reset it. */
            type?: ButtonType;
        }
>;

export type ButtonProps = Omit<InteractionWrapperProps, "renderControl"> &
    AccessorProps<
        ButtonCbs &
            Pick<InteractionControlProps, "id" | "ariaLabel" | "renderContent"> & {
                /**
                 * What the button does inside a form. It defaults to doing nothing, so a button in a form
                 * does not submit it by accident.
                 */
                type?: ButtonType;
            }
    >;
