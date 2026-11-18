import type { AccordionPolicy } from "./AccordionPage.types";

export const DOCS_ROOT = "/src/App/Pages/Accordions/AccordionPage/Docs";

export const FIELD_WIDTH = 110;

export const DOCS_GAP = 5;

export const ACCORDION_POLICIES: AccordionPolicy[] = ["many", "single", "single_required"];

export const DEFAULT_ACCORDION_POLICY: AccordionPolicy = "many";

export const DOCS_SECTIONS = {
    openingClosingOutside: {
        title: "Opening and closing from outside",
        content:
            "The accordion keeps track of which sections are open by itself. To open or close them from elsewhere on the page, hold the list and pass it in as [prop]expanded[/prop]: both sides write it, so a header press updates your list and writing your list opens or closes sections.",
    },
    panelsFollowContent: {
        title: "Panels that follow their content",
        content:
            "A panel opens to its content's own height and keeps following it. Content that appears after the panel is open makes the panel grow, with no reopening and no height to guess.",
    },
    builtFirstOpen: {
        title: "Built on first open",
        content:
            "Set [prop]isPanelBuiltOnExpand[/prop] and a panel's content is not built until its section is first opened, and it stays built afterwards. Use it for panels that are costly to build.",
    },
    scrolledIntoView: {
        title: "Scrolled into view",
        content:
            "Set [prop]isScrolledIntoViewOnExpand[/prop] and a section is brought into view once it has finished opening, which matters when the accordion sits in a box that scrolls: opening a section below the fold brings it up.",
    },
    orientation: {
        title: "Orientation",
        content:
            "Set [prop]orientation[/prop] to horizontal and the sections sit side by side, each panel opening beside its header and growing in width; vertical, the default, stacks them. The arrow keys that walk the headers follow it: up and down for a column, left and right for a row, reversed in right-to-left text. The panel is also told which way the person moved, forward or backward, so its content can slide in from that side; the motion is yours.",
    },
};

export const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
    Unavailable: ["This section is disabled, so its header refuses to open it."],
};

export const ENABLED_SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

export const PANEL_BODIES: Record<string, string> = {
    Mountains: "Cold air, long views and a path that only goes up.",
    Coast: "Salt, wind and a horizon that never quite arrives.",
    Forest: "Green light, soft ground and no straight lines anywhere.",
    Desert: "Heat by day, stars by night, and silence in between.",
};

export const SCROLLED_SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
    Assembly: [
        "Lay every part out before starting.",
        "Count the bolts against the list; there are four lengths and they are not interchangeable.",
        "The long bolts go through the side panels, the short ones into the base.",
        "Fit the back panel before the shelves, or it will not go in afterwards.",
        "Tighten everything by hand first.",
        "Stand it up, then go round again and tighten properly.",
        "Check it does not rock before loading it.",
        "Keep the spare washers; there is always one.",
        "This panel is taller than the box it sits in, so opening it puts its header at the top.",
    ],
};
