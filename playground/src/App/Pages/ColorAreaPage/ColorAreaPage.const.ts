import { Color } from "@thewaver/ss-utils";

export const EXAMPLE_NAMES = {
    bare: "The surface alone",
    dropdown: "In a dropdown, replacing the OS dialog",
    disabled: "Disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ColorAreaPage/Examples";

export const STARTING_HSV: Color.HSVA = { h: 210, s: 70, v: 90, a: 1 };

export const STARTING_PICKER_HSV: Color.HSVA = { h: 90, s: 50, v: 80, a: 1 };

export const STARTING_DISABLED_HSV: Color.HSVA = { h: 0, s: 60, v: 60, a: 1 };

export const DOCS_ROOT = "/src/App/Pages/ColorAreaPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the square stays as it is. It is a picture of color rather than text, so saturation still grows to the right and brightness upward, and the right arrow still moves the handle right, as it does on screen.",
    },
    pickerBuiltAround: {
        title: "A picker built around it",
        content:
            "The square moves saturation and brightness and nothing else, so a picker adds the rest around it. Here a button opens a dialog holding the square, a Range for the hue and a field for each channel, all reading and writing one [prop]hsv[/prop] signal. The button says what it opens through [prop]ariaHasPopup[/prop] and whether it is open through [prop]ariaExpanded[/prop], so a screen reader hears both before and after the press. ColorInput is this picker ready-made.",
    },
};

export const SATURATION_BRIGHTNESS_LABEL = "Saturation and brightness";

export const SATURATION_BRIGHTNESS_RIGHT_LEFT_LABEL = "Saturation and brightness in a right-to-left box";
