import { createContext } from "svelte";

import type { PaintAreaContextType } from "./PaintArea.context.types.js";

const [getContext, setContext, hasContext] = createContext<PaintAreaContextType>();

export const setPaintAreaContext = (context: PaintAreaContextType) => setContext(context);

export const getPaintAreaContext = (): PaintAreaContextType | undefined => (hasContext() ? getContext() : undefined);
