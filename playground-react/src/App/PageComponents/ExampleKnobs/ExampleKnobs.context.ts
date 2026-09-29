import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const ExampleKnobsContext = createContext<
    { setRenderKnobs: (render: (() => ReactNode) | undefined) => void } | undefined
>(undefined);

export const ExampleKnobsContextProvider = ExampleKnobsContext.Provider;

export const useExampleKnobsContext = () => useContext(ExampleKnobsContext);
