import type { AnchorPlacement } from "@thewaver/ss-components";

export const GETTING_STARTED_ROUTE = "/getting-started";

export const GALLERY_ROUTE = "/gallery";

export const GALLERY_NAME_SEPARATOR = " / ";

export const NAV_PREVIEW_PLACEMENT: AnchorPlacement = { x: "right_out", y: "center" };

export const NAV_PREVIEW_OFFSET = { x: 10, y: 0 };

export const NAV_PREVIEW_ARROW = "triangle";

export const SHOW_COMPOSITES = false;

export const LIST_PAGELESS_COMPONENTS = false;

export const SEARCH_FIELD_WIDTH = 280;

export const MENU_ID = "library-menu";

export const MENU_EDGE = "left";

export const PREVIEW_EXCLUDED_PAGES = ["AudioSwitcher", "CommandPalette", "ImageSwitcher", "ViewportWrapper"];

export const SCREEN_HEIGHT = window.screen.height;

export const DEPENDENCY_SECTIONS = [
    { key: "uses" as const, label: "Uses" },
    { key: "usedBy" as const, label: "Used by" },
];

export const DEPENDENCY_GROUPS = [
    { key: "abstracts" as const, label: "Abstracts", singular: "Abstract" },
    { key: "generators" as const, label: "Generators", singular: "Generator" },
    { key: "primitives" as const, label: "Primitives", singular: "Primitive" },
    { key: "components" as const, label: "Components", singular: "Component" },
];

export const FIXED_ANCHOR_RATIO = { width: 16, height: 9 };
