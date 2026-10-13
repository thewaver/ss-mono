import type { Breadcrumb } from "@thewaver/ss-components";

import type { CrumbValue } from "./BreadcrumbTrail.types";

export type BaseBreadcrumbsExampleValues = {
    crumbs: Breadcrumb<CrumbValue>[];
};

export type BaseBreadcrumbsExampleCbs = {
    onSelect?: (value: CrumbValue) => void;
};

export type BaseBreadcrumbsExampleProps = BaseBreadcrumbsExampleValues & BaseBreadcrumbsExampleCbs;
