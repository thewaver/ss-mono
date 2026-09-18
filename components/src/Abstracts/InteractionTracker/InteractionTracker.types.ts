export type ExternalInteractionFlags = {
    /**
     * Turns the control off. It keeps its place in the layout and stays readable rather than being greyed
     * out by the browser, because the library marks it disabled rather than using the native attribute —
     * which is what lets a disabled control still explain itself.
     */
    isDisabled?: boolean;
    /**
     * Whether the control is holding a state rather than performing an action, for a toggle button that
     * stays down once pressed.
     */
    isPressed?: boolean;
    /** Puts the control into its error look, without changing what it accepts or how it behaves. */
    hasError?: boolean;
};

export type InternalInteractionFlags = {
    /** Whether the pointer is over the control. */
    isHovered?: boolean;
    /** Whether the control is being pressed right now, between the press going down and coming back up. */
    isActive?: boolean;
    /** Whether the control holds focus, however it was reached. */
    isFocused?: boolean;
    /**
     * Whether the control holds focus and the browser thinks a focus ring should be drawn — true after
     * tabbing to it, false after clicking it. Paint the ring off this rather than off `isFocused`.
     */
    isFocusVisible?: boolean;
};

export type InteractionActivation = {
    /** How far the control was dragged before it was let go, as a share of its own size on each axis. */
    ratio: InteractionDragRatio;
    /** How many activations have landed in quick succession, so a double click can be told from two clicks. */
    count: number;
};

export type InteractionFlags<TExtra extends object = {}> = InternalInteractionFlags & ExternalInteractionFlags & TExtra;

export type InteractionDragRatio = {
    /** Sideways travel, as a share of the control's own width. */
    x: number;
    /** Vertical travel, as a share of the control's own height. */
    y: number;
};

export type InteractionDragEndReason = "release" | "cancel";
