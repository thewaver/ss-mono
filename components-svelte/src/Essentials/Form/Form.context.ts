import { createContext } from "svelte";

import type { FormContextType } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<FormContextType>();

export const setFormContext = (context: FormContextType) => setContext(context);

export const getFormContext = (): FormContextType | undefined => (hasContext() ? getContext() : undefined);
