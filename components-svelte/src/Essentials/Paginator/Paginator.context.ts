import { createContext } from "svelte";

import { PaginatorUtils } from "@thewaver/ss-components";

import type { PaginatorSvelteContextType } from "./Paginator.context.types.js";

const [getContext, setContext, hasContext] = createContext<PaginatorSvelteContextType>();

export const setPaginatorContext = (context: PaginatorSvelteContextType) => setContext(context);

export const getPaginatorContext = (piece: string): PaginatorSvelteContextType | undefined => {
    const context = hasContext() ? getContext() : undefined;

    if (!context) PaginatorUtils.warnOutsideRoot(piece);

    return context;
};
