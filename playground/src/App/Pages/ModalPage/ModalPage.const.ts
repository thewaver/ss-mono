export const EXAMPLE_NAMES = {
    default: "Default",
    destructiveConfirmation: "Destructive confirmation",
    layered: "A popup inside it",
    textOnly: "Nothing focusable inside",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ModalPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/ModalPage/Docs";

export const FIELD_WIDTH = 110;

export const NOTHING_DECIDED = "nothing decided yet";

export const DOCS_SECTIONS = {
    dialogThatMustBeAnswered: {
        title: "A dialog that must be answered",
        content:
            "Set [prop]role[/prop] to alertdialog for a dialog that interrupts to ask for a decision, so it is announced more insistently than an ordinary one. Point [prop]initialFocusRef[/prop] at the answer that loses nothing, Cancel here, so that is where focus lands. Switching off [prop]isDismissableOnOverlayClick[/prop] keeps a press beside the dialog from closing it, and switching off [prop]isDismissableOnEscape[/prop] does the same for Escape, so the only way out is an answer.",
    },
    popupInside: {
        title: "A popup inside it",
        content:
            "A popup opened inside the dialog, such as this list, is a layer above it. Escape closes only the layer on top: the first press closes the list and leaves the dialog open, and the next closes the dialog.",
    },
    dragInside: {
        title: "A drag inside it",
        content:
            "Escape pressed while something inside the dialog is being dragged cancels the drag and leaves the dialog open. Try it here: start dragging a column header, press Escape, and the column goes back while the dialog stays. A second Escape then closes the dialog.",
    },
    nothingFocusableInside: {
        title: "Nothing focusable inside",
        content:
            "On opening, focus goes to [prop]initialFocusRef[/prop] when there is one, and otherwise to the first thing inside that can take it. A dialog holding only text has nothing that can, so the dialog takes focus itself rather than leaving it on the page behind.",
    },
};

export const PARTS_REORDERABLE_COLUMNS_LABEL = "Parts with reorderable columns";
