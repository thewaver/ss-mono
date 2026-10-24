import { createContext, useContext } from "react";

type PreviewContextValue = {
    claimDemo: (claimantId: string) => boolean;
};

const PreviewContext = createContext<PreviewContextValue | undefined>(undefined);

export const PreviewContextProvider = PreviewContext.Provider;

export const usePreviewContext = () => useContext(PreviewContext);

export const useIsPreview = () => usePreviewContext() !== undefined;
