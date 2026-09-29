import { type InjectionKey, inject, provide } from "vue";

import { type TableHeaderContextType, TableUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

const TABLE_HEADER_CONTEXT_KEY: InjectionKey<TableHeaderContextType> = Symbol("TableHeaderContext");

export const provideTableHeaderContext = (context: TableHeaderContextType) =>
    provide(TABLE_HEADER_CONTEXT_KEY, context);

export const useTableHeaderContext = (control: string): TableHeaderContextType | undefined => {
    const context = inject(TABLE_HEADER_CONTEXT_KEY, undefined);

    watchAfterRender([], () => {
        if (!context) TableUtils.warnOutsideHeader(control);
    });

    return context;
};
