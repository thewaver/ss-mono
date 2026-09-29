import type { Snippet } from "svelte";
import { createContext } from "svelte";

const [getContext, setContext, hasContext] = createContext<{
    setRenderKnobs: (render: Snippet | undefined) => void;
}>();

export const setExampleKnobsContext = (context: { setRenderKnobs: (render: Snippet | undefined) => void }) =>
    setContext(context);

export const getExampleKnobsContext = () => (hasContext() ? getContext() : undefined);
