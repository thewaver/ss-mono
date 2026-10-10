import { createContext } from "svelte";

const [getContext, setContext, hasContext] = createContext<boolean>();

export const setPreviewContext = (isPreview: boolean) => setContext(isPreview);

export const getIsPreview = () => (hasContext() ? getContext() : false);
