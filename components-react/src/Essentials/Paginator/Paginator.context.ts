import { createContext, useContext, useEffect } from "react";

import { PaginatorUtils } from "@thewaver/ss-components";

import type { PaginatorReactContextType } from "./Paginator.context.types";

const PaginatorContext = createContext<PaginatorReactContextType | undefined>(undefined);

export const PaginatorContextProvider = PaginatorContext.Provider;

export const usePaginatorContext = (piece: string): PaginatorReactContextType | undefined => {
    const context = useContext(PaginatorContext);

    useEffect(() => {
        if (!context) PaginatorUtils.warnOutsideRoot(piece);
    }, [context === undefined]);

    return context;
};
