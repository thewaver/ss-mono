import type { Component } from "svelte";

import type { PaginatorContextType } from "@thewaver/ss-components";

import type { PaginatorLinkProps } from "./Paginator.types.js";

export type PaginatorSvelteContextType = PaginatorContextType & {
    getLinkComponent: () => Component<PaginatorLinkProps> | undefined;
};
