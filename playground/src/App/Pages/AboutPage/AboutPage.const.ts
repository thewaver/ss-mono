import type { AboutInline, AboutLink } from "./AboutPage.types";

export const ABOUT_SOURCE_LINK: AboutLink = { text: "open-source", href: "https://github.com/thewaver/ss-mono" };

export const ABOUT_WCAG_LINK: AboutLink = { text: "WCAG", href: "https://www.w3.org/WAI/standards-guidelines/wcag/" };

export const ABOUT_COMPONENT_KINDS =
    "buttons, text and number fields, date and time pickers, selects, menus, modals, tabs, trees, tables, carousels, and a set of visual and motion effects besides";

export const ABOUT_HEADLESS =
    "It is headless. Every component brings its structure, its behavior and its accessibility wiring, and none of the color, spacing or type. What a component looks like is yours to draw.";

export const ABOUT_SHARED_CORE = "All four sit on one framework-free core, so a control behaves the same way in each.";

export const ABOUT_HOW_IT_WORKS =
    "A component is a box that behaves. You mount it, give it its data, and give it a render function for whatever it draws. The library calls that function with the control's current state, such as hovered, pressed, showing a focus ring, disabled or open, and you return the markup and styling for that state.";

export const ABOUT_PHILOSOPHY: AboutInline[][] = [
    [
        "The library owns behavior and you own looks. A component never decides its own paint, so there is nothing to override and nothing to fight.",
    ],
    [
        "Accessible by default. Keyboard routes, focus handling and ARIA roles come built in and are checked against ",
        ABOUT_WCAG_LINK,
        ". Where a choice of yours would leave a control failing a criterion, the library says so loudly in development instead of quietly going along.",
    ],
    [
        "Your words, not ours. Apart from the name of what a control is, the library ships no sentence a reader would hear or see. Labels and announcements arrive through props, so a page in another language is never read out in English.",
    ],
    [
        "Controls stay out of the way. A component hands you a controller and draws no buttons of its own, so where the buttons go, and how they look, is your decision.",
    ],
    [
        "Nothing is hidden. The pieces the components are built from are exported too, so you can build the control the library does not have.",
    ],
    ["One name for one thing. A prop is called the same in every framework; only the way you hand it in changes."],
];
