import { createContext } from "svelte";

import type { PagePropsPanelScope } from "./PropsPanelSvelte.types";

const [getContext, setContext, hasContext] = createContext<{ scope: PagePropsPanelScope }>();

export const setPropsPanelContext = (context: { scope: PagePropsPanelScope }) => setContext(context);

export const getPropsPanelContext = () => (hasContext() ? getContext() : undefined);
