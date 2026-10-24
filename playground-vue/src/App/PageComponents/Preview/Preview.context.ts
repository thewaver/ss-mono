import { type InjectionKey, inject, provide } from "vue";

export type PreviewContextType = {
    claimDemo: () => boolean;
};

const PREVIEW_CONTEXT_KEY: InjectionKey<PreviewContextType> = Symbol("PreviewContext");

export const providePreviewContext = (value: PreviewContextType) => provide(PREVIEW_CONTEXT_KEY, value);

export const usePreviewContext = () => inject(PREVIEW_CONTEXT_KEY, undefined);

export const useIsPreview = () => usePreviewContext() !== undefined;
