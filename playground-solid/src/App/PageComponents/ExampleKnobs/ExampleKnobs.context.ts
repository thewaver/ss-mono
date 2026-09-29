import type { JSX } from "solid-js";
import { createContext, useContext } from "solid-js";

const ExampleKnobsContext = createContext<{ setRenderKnobs: (render: (() => JSX.Element) | undefined) => void }>();

export const ExampleKnobsContextProvider = ExampleKnobsContext.Provider;

export const useExampleKnobsContext = () => useContext(ExampleKnobsContext);
