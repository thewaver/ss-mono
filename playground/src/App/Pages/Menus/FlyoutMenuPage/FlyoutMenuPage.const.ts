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
