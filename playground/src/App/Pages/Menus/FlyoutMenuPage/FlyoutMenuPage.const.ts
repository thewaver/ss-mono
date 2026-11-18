import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    shop: "A shop's navigation",
    narrow: "Too narrow for every entry",
};

export const EXAMPLES_ROOT = "/src/App/Pages/Menus/FlyoutMenuPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/Menus/FlyoutMenuPage/Docs";

export const FIELD_WIDTH = 110;

export const NOTHING_FOLLOWED = "no link followed yet";

export const OVERFLOW_CAPTION = "More";

export const SHOP_ENTRIES: FlyoutMenuEntryRecord<string>[] = [
    {
        value: "Clothing",
        href: "#clothing",
        links: [
            { value: "Shirts", href: "#clothing-shirts" },
            { value: "Skirts", href: "#clothing-skirts" },
            { value: "Shoes", href: "#clothing-shoes" },
        ],
    },
    {
        value: "Homeware",
        href: "#homeware",
        links: [
            { value: "Kitchen", href: "#homeware-kitchen" },
            { value: "Lighting", href: "#homeware-lighting" },
            { value: "Textiles and rugs", href: "#homeware-textiles" },
        ],
    },
    {
        value: "Garden",
        href: "#garden",
        links: [
            { value: "Tools", href: "#garden-tools" },
            { value: "Plants", href: "#garden-plants" },
        ],
    },
    { value: "Sale", href: "#sale" },
    { value: "Journal", href: "#journal" },
];

export const DOCS_SECTIONS = {
    tooNarrowEveryEntry: {
        title: "Too narrow for every entry",
        content:
            "The bar measures itself, and the entries that do not fit collapse into a last one. Inside its panel each collapsed entry keeps its link and its toggle, and the toggle opens that entry's links in place. Give an entry a [prop]collapse[/prop] of never to keep it on the bar, or always to send it to the end whatever the room.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the entries run from the right, each toggle sits to the left of its link, and Tab walks them in that order. The panel takes the box's direction although it is drawn outside it: it hangs from the right edge of its entry and its links read from the right. A [prop]placement[/prop] you give is used as it stands.",
    },
};
