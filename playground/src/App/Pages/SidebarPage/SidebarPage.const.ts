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

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the sidebar stays on the side [prop]edge[/prop] names, the left here, since its edges are the screen's sides; its contents and the content beside it run from the right.",
    },
    overNeighbor: {
        title: "Over its neighbor",
        content:
            "Set [prop]layout[/prop] to overlay and the sidebar grows over the content beside it instead of pushing it aside. In the layout it only ever takes its collapsed size, so the neighbor never moves; the panel grows out from the docked edge, raised above what it covers.",
    },
    expandingHover: {
        title: "Expanding on hover",
        content:
            'With [prop]isExpandedOnHover[/prop] on, resting the pointer on the sidebar for [prop]hoverShowDelayMs[/prop] expands it, and moving away, pressing Escape or pressing elsewhere collapses it again ([wcag id="1.4.13"]WCAG 1.4.13[/wcag]). It never writes [prop]expanded[/prop], so the button still reads collapsed while the sidebar is only being looked at, and a sidebar expanded by the button stays expanded when the pointer leaves.',
    },
};
