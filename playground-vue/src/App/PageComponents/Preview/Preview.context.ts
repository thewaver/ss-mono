import { type InjectionKey, inject, provide } from "vue";

const PREVIEW_CONTEXT_KEY: InjectionKey<boolean> = Symbol("PreviewContext");

export const providePreviewContext = (value: boolean) => provide(PREVIEW_CONTEXT_KEY, value);

export const useIsPreview = () => inject(PREVIEW_CONTEXT_KEY, false);
