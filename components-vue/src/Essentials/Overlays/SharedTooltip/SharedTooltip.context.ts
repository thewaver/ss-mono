import { type InjectionKey, inject, provide } from "vue";

import type { SharedTooltipContextType } from "./SharedTooltip.context.types";

const SHARED_TOOLTIP_CONTEXT_KEY: InjectionKey<SharedTooltipContextType> = Symbol("SharedTooltipContext");

export const provideSharedTooltipContext = (context: SharedTooltipContextType) =>
    provide(SHARED_TOOLTIP_CONTEXT_KEY, context);

export const useSharedTooltipContext = (): SharedTooltipContextType | undefined =>
    inject(SHARED_TOOLTIP_CONTEXT_KEY, undefined);
