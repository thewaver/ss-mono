export const EXAMPLE_NAMES = {
    default: "File, Edit and View",
};

export const EXAMPLES_ROOT = "/src/App/Pages/MenubarPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/MenubarPage/Docs";

export const DOCS_SECTIONS = {
    wordsThatDoNotFit: {
        title: "When the words do not fit",
        content:
            "The bar measures itself, and the words that do not fit move into an overflow menu at its end, each becoming a submenu of it that holds that word's own menu. One [prop]checked[/prop], [prop]renderItem[/prop] and [prop]renderPopup[/prop] serve every menu the bar opens, the overflow menu included, so a View option keeps its state wherever View is drawn.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the words run from the right, and the left arrow moves on to the next word. Each menu hangs from the right edge of its word, and its submenus open to the left, where the left arrow opens them.",
    },
};

export const RIGHT_LEFT_EDITOR_LABEL = "Right-to-left editor";
