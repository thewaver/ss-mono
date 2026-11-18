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

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the trail starts from the right, with the first crumb rightmost. A separator that points, such as the > here, is drawn mirrored by the browser, so it still points along the trail; a slash or a dash is drawn as it is, so pick one that reads either way.",
    },
    links: {
        title: "Links",
        content:
            "Give a crumb an [prop]href[/prop] and it is drawn as a native HTML anchor element, with the address passed through untouched. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the crumbs are drawn with it instead.",
    },
};
