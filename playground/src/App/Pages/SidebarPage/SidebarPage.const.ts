import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    push: "Pushing its neighbor",
    overlay: "Over its neighbor, from the right",
    hover: "Expanding on hover",
};

export const EXAMPLES_ROOT = "/src/App/Pages/SidebarPage/Examples";

export const VARIANTS: {
    key: string;
    name: string;
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    note: string;
}[] = [
    {
        key: "push",
        name: EXAMPLE_NAMES.push,
        edge: "left",
        layout: "push",
        isExpandedOnHover: false,
        note: "the content beside it narrows as it grows",
    },
    {
        key: "overlay",
        name: EXAMPLE_NAMES.overlay,
        edge: "right",
        layout: "overlay",
        isExpandedOnHover: false,
        note: "it only ever takes its collapsed width, and grows over the content",
    },
    {
        key: "hover",
        name: EXAMPLE_NAMES.hover,
        edge: "left",
        layout: "overlay",
        isExpandedOnHover: true,
        note: "resting on it expands it without touching the state; the button still pins it open",
    },
];

export const DOCS_ROOT = "/src/App/Pages/SidebarPage/Docs";

export const FIELD_WIDTH = 110;

export const COLLAPSED_SIZE = 48;

export const EXPANDED_SIZE = 200;

export const MAILBOXES = ["Inbox", "Drafts", "Sent", "Archive", "Spam"];
