import type { CrumbValue } from "./BreadcrumbTrail.types";

export const BREADCRUMBS_GAP = 0;

export const TRAIL: { value: CrumbValue; label: string }[] = [
    { value: "home", label: "Home" },
    { value: "library", label: "Library" },
    { value: "inputs", label: "Inputs" },
    { value: "text", label: "Text" },
    { value: "field", label: "Field" },
];

export const labelOf = (value: CrumbValue) => TRAIL.find((entry) => entry.value === value)!.label;

export const EXAMPLE_NAMES = {
    default: "Default",
    bare: "No separator",
    linked: "Crumbs that are links",
    linkComponent: "Links through a component",
};

export const DEPTH_FIELD_WIDTH = 90;

export const EXAMPLES_ROOT = "/src/App/Pages/BreadcrumbsPage/Examples";
