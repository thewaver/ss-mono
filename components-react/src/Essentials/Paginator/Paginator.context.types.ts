import type { ComponentType } from "react";

import type { PaginatorContextType, PaginatorControlEntry } from "@thewaver/ss-components";

import type { PaginatorLinkProps } from "./Paginator.types";

export type PaginatorReactContextType = Omit<PaginatorContextType, "register"> & {
    getLinkComponent: () => ComponentType<PaginatorLinkProps> | undefined;
    register: (entry: PaginatorControlEntry) => () => void;
};
