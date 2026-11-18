import type { Topping } from "./CheckboxGroupTopping.types";

export const GROUP_GAP = 10;

export const TOPPINGS: Topping[] = [
    { value: "cheese", label: "Cheese" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
    { value: "peppers", label: "Peppers" },
];

export const TOPPINGS_WITH_SOLD_OUT: Topping[] = [
    ...TOPPINGS,
    { value: "anchovies", label: "Anchovies (sold out)", isSoldOut: true },
];

export const EXAMPLE_NAMES = {
    default: "Default",
    selectAll: "With a select-all box",
};

export const EXAMPLES_ROOT = "/src/App/Pages/CheckboxGroupPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/CheckboxGroupPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, a row of boxes starts from the right, and each box sits to the right of its words. Tab still visits the boxes in the order they are written.",
    },
    selectAllBox: {
        title: "A select-all box",
        content:
            "The group draws no box of its own for selecting everything; [prop]onMount[/prop] hands over a controller for one you draw. Its [prop]getCheckedState[/prop] says whether every box is ticked, none is, or they disagree, which the box here shows as mixed, and [prop]setIsEveryChecked[/prop] ticks or clears them all at once. A disabled box keeps whatever it had and is left out of the count, so the sold-out topping cannot leave the select-all box mixed for good.",
    },
};
