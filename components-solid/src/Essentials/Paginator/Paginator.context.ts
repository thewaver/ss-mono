import { createContext, useContext } from "solid-js";

import { PaginatorUtils } from "@thewaver/ss-components";

import type { PaginatorSolidContextType } from "./PaginatorSolid.types";

const PaginatorContext = createContext<PaginatorSolidContextType>();

export const PaginatorContextProvider = PaginatorContext.Provider;

export const usePaginatorContext = (piece: string): PaginatorSolidContextType | undefined => {
    const context = useContext(PaginatorContext);

    if (!context) PaginatorUtils.warnOutsideRoot(piece);

    return context;
};
