import { createContext, useContext } from "solid-js";

const PreviewContext = createContext(false);

export const PreviewContextProvider = PreviewContext.Provider;

export const useIsPreview = () => useContext(PreviewContext);
