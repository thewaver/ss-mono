import { createContext } from "svelte";

import type { CheckboxGroupSvelteContextType } from "./CheckboxGroup.context.types.js";

const [getContext, setContext, hasContext] = createContext<CheckboxGroupSvelteContextType>();

export const setCheckboxGroupContext = (context: CheckboxGroupSvelteContextType) => setContext(context);

export const getCheckboxGroupContext = (): CheckboxGroupSvelteContextType | undefined =>
    hasContext() ? getContext() : undefined;
