import type { AccessorProps, Breadcrumb } from "@thewaver/ss-components";

export type CrumbValue = "home" | "library" | "inputs" | "text" | "field";

export type BreadcrumbsExampleProps = AccessorProps<{
    crumbs: Breadcrumb<CrumbValue>[];
}> & {
    onSelect?: (value: CrumbValue) => void;
};
