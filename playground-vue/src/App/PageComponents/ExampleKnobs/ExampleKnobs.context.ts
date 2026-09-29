import { type InjectionKey, type VNodeChild, inject, provide } from "vue";

export type ExampleKnobsContextType = {
    setRenderKnobs: (render: (() => VNodeChild) | undefined) => void;
};

const EXAMPLE_KNOBS_CONTEXT_KEY: InjectionKey<ExampleKnobsContextType> = Symbol("ExampleKnobsContext");

export const provideExampleKnobsContext = (value: ExampleKnobsContextType) =>
    provide(EXAMPLE_KNOBS_CONTEXT_KEY, value);

export const useExampleKnobsContext = () => inject(EXAMPLE_KNOBS_CONTEXT_KEY, undefined);
