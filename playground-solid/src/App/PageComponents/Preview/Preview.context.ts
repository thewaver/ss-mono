import { createContext, useContext } from "solid-js";

type PreviewContextValue = {
    claimDemo: () => boolean;
};

const PreviewContext = createContext<PreviewContextValue>();

export const PreviewContextProvider = PreviewContext.Provider;

export const usePreviewContext = () => useContext(PreviewContext);

export const useIsPreview = () => usePreviewContext() !== undefined;
