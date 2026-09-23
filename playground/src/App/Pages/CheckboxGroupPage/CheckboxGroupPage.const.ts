import type { Topping } from "./CheckboxGroupPage.types";

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
