import { createContext } from "svelte";

import type { DocsSectionRegistration } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

type DocsViewContextValue = {
    register: (section: DocsSectionRegistration) => () => void;
};

const [getContext, setContext, hasContext] = createContext<DocsViewContextValue>();

export const setDocsViewContext = (context: DocsViewContextValue) => setContext(context);

export const getDocsViewContext = () => (hasContext() ? getContext() : undefined);
