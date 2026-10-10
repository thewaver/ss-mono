import { createContext, useContext } from "react";

const PreviewContext = createContext(false);

export const PreviewContextProvider = PreviewContext.Provider;

export const useIsPreview = () => useContext(PreviewContext);
