export const EXAMPLE_NAMES = {
    default: "Default",
    empty: "Empty",
    unique: "Refusing duplicates",
    crowded: "Crowded and narrow",
    rightToLeft: "In a right-to-left box",
};

export const NARROW_WIDTH = 240;

export const EXAMPLES_ROOT = "/src/App/Pages/TagInputPage/Examples";

export const STARTING_TAGS = ["solid", "vanilla-extract"];

export const CROWDED_TAGS = [
    "solid",
    "vanilla-extract",
    "playwright",
    "typescript",
    "vite",
    "eslint",
    "prettier",
    "vitest",
    "aria",
    "tokens",
    "signals",
    "stores",
];

export const DOCS_ROOT = "/src/App/Pages/TagInputPage/Docs";

export const DOCS_SECTIONS = {
    placeholder: {
        title: "Placeholder",
        content:
            "While the field holds no tags and nothing is typed, it draws [prop]renderPlaceholder[/prop]; the first letter typed hides it, and so does a tag.",
    },
    refusingWord: {
        title: "Refusing a word",
        content:
            "Every word passes through [prop]computeTag[/prop] before it becomes a tag, which can trim it, change it, or refuse it by answering with nothing. Here words are trimmed and lower-cased, and one already in the list is refused and stays in the field to be edited.",
    },
    manyTagsNarrowBox: {
        title: "Many tags in a narrow box",
        content:
            "Tags that do not fit on one line wrap onto the next, and the box grows to hold them: nothing is cut off and nothing scrolls. The field always takes a row of its own beneath the tags.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the tags run from the right, and the arrows are mirrored: from the empty field the right arrow steps back into the tags, and the left arrow walks back toward the field.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field.",
    },
};

export const TOPICS_RIGHT_LEFT_BOX_LABEL = "Topics in a right-to-left box";

export const DISABLED_BUT_REACHABLE_TOPICS_LABEL = "Disabled but reachable topics";
