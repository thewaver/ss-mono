import { type InjectionKey, inject, provide } from "vue";

import { PaginatorUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import type { PaginatorVueContextType } from "./Paginator.types";

const PAGINATOR_CONTEXT_KEY: InjectionKey<PaginatorVueContextType> = Symbol("PaginatorContext");

export const providePaginatorContext = (context: PaginatorVueContextType) => provide(PAGINATOR_CONTEXT_KEY, context);

export const usePaginatorContext = (piece: string): PaginatorVueContextType | undefined => {
    const context = inject(PAGINATOR_CONTEXT_KEY, undefined);

    watchAfterRender([], () => {
        if (!context) PaginatorUtils.warnOutsideRoot(piece);
    });

    return context;
};
