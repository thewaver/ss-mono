import type { AccessorProps, Breadcrumb } from "@thewaver/ss-components-solid";
import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";

export type BreadcrumbsExampleProps = AccessorProps<{
    crumbs: Breadcrumb<CrumbValue>[];
    onSelect?: (value: CrumbValue) => void;
}>;
