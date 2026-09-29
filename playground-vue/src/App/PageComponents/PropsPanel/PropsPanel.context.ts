import { type InjectionKey, inject, provide } from "vue";

import type { PagePropsPanelScope } from "./PropsPanel.types";

const PROPS_PANEL_CONTEXT_KEY: InjectionKey<{ scope: PagePropsPanelScope }> = Symbol("PropsPanelContext");

export const providePropsPanelContext = (value: { scope: PagePropsPanelScope }) =>
    provide(PROPS_PANEL_CONTEXT_KEY, value);

export const usePropsPanelContext = () => inject(PROPS_PANEL_CONTEXT_KEY, undefined);
