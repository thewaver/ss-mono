import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";

import type { ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type ButtonCbs = {
    /**
     * Runs when the button is activated. It is given the event so a consumer can tell a click from the keyboard
     * activation that Enter and Space also produce. Answer with a promise and the button stays pending until it
     * settles, ignoring any press in the meantime; a rejection is not caught.
     */
    onClick?: (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void | Promise<void>;
    /** Runs as the press goes down, before it is known whether it will become an activation. */
    onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
    /** Runs as the press comes back up, whether or not it activated the button. */
    onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type ButtonElementProps = ButtonCbs &
    InteractionControlProps<ButtonFlags> & {
        /** What the button does inside a form: nothing, submit it, or reset it. */
        type?: ButtonType;
    };

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    ButtonCbs &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent"> & {
        /**
         * What the button does inside a form. It defaults to doing nothing, so a button in a form does not submit it
         * by accident. A disabled or pending button neither submits nor resets.
         */
        type?: ButtonType;
    };
