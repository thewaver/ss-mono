import { type InjectionKey, inject, provide } from "vue";

import type { DocsSectionRegistration } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type DocsViewContextType = {
    register: (section: DocsSectionRegistration) => () => void;
};

const DOCS_VIEW_CONTEXT_KEY: InjectionKey<DocsViewContextType> = Symbol("DocsViewContext");

export const provideDocsViewContext = (value: DocsViewContextType) => provide(DOCS_VIEW_CONTEXT_KEY, value);

export const useDocsViewContext = () => inject(DOCS_VIEW_CONTEXT_KEY, undefined);
