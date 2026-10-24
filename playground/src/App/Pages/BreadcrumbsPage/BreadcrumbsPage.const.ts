import type { CrumbValue } from "./BreadcrumbTrail.types";
import type { BreadcrumbSeparatorKey } from "./BreadcrumbsPage.types";

export const BREADCRUMBS_GAP = 0;

export const TRAIL: { value: CrumbValue; label: string }[] = [
    { value: "home", label: "Home" },
    { value: "library", label: "Library" },
    { value: "inputs", label: "Inputs" },
    { value: "text", label: "Text" },
];

export const labelOf = (value: CrumbValue) => TRAIL.find((entry) => entry.value === value)!.label;

export const BREADCRUMB_SEPARATORS: BreadcrumbSeparatorKey[] = ["/", ">", "-", "none"];

export const DOCS_ROOT = "/src/App/Pages/BreadcrumbsPage/Docs";
