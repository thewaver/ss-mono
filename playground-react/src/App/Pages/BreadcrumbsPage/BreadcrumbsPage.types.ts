import type { Breadcrumb } from "@thewaver/ss-components-react";
import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";

export type BreadcrumbsExampleProps = {
    crumbs: Breadcrumb<CrumbValue>[];
    onSelect?: (value: CrumbValue) => void;
};
