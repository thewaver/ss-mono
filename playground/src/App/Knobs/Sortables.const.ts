export namespace SortableKnobs {
    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the cards are stacked or sit side by side. While one is carried, the up and down arrows choose its place in a stack, and the left and right arrows in a row.",
        controls: "Sets SortableProps.orientation",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the list off: nothing in it can be picked up or moved, by pointer or by key.",
        controls: "Sets SortableProps.isDisabled",
    };

    export const IS_BOARD_LOCKED_TEXT = {
        label: "Board locked",
        hint: "Whether the board refuses every card from the hand, while its own cards can still be reordered.",
        controls: "Sets SortableProps.isLocked on the board",
    };
}
