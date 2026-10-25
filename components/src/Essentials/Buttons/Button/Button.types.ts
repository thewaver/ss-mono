export type ButtonType = "button" | "submit" | "reset";

export type ButtonPopupRole = "menu" | "listbox" | "tree" | "grid" | "dialog";

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

export type BaseButtonValues = {
    /**
     * What the button does inside a form. It defaults to doing nothing, so a button in a form does not submit it by
     * accident. A disabled or pending button neither submits nor resets.
     */
    type?: ButtonType;
    /**
     * What kind of popup pressing the button opens, for a button that opens one: a menu, a list to pick from, a
     * tree, a grid or a dialog. A screen reader then says so before the button is pressed. Leave it out for a button
     * that opens nothing. Pair it with `ariaExpanded`, so the reader also hears whether the popup is open.
     */
    ariaHasPopup?: ButtonPopupRole;
    /**
     * Whether what the button opens or shows is open right now — a popup, or a section it expands. Hand it the same
     * state the popup is drawn from, so the two never disagree. Leave it out for a button that opens nothing, since
     * `false` announces a button that can be expanded.
     */
    ariaExpanded?: boolean;
    /**
     * The id of the element the button acts on, for a button that changes something drawn elsewhere — a box it
     * scrolls, a carousel it steps. A screen reader can then take the reader from the button to that element. Leave
     * it out for a button that acts on nothing in the page.
     */
    ariaControls?: string;
};

export type BaseButtonProps = BaseButtonValues & ButtonCbs;
