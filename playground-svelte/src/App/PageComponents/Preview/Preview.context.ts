import { createContext } from "svelte";

type PreviewContextValue = {
    claimDemo: () => boolean;
};

const [getContext, setContext, hasContext] = createContext<PreviewContextValue>();

export const setPreviewContext = (context: PreviewContextValue) => setContext(context);

export const getPreviewContext = () => (hasContext() ? getContext() : undefined);

export const getIsPreview = () => getPreviewContext() !== undefined;
