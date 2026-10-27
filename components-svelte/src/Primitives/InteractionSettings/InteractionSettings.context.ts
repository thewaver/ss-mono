import { createContext } from "svelte";

import { type InteractionSettingsContextType, InteractionSettingsUtils } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<InteractionSettingsContextType>();

export const setInteractionSettingsContext = (context: InteractionSettingsContextType) => setContext(context);

/**
 * Reads the settings that apply here: those of the nearest enclosing `InteractionSettings`, merged over the ones above
 * it.
 *
 * Outside any wrapper it answers with every setting at its default rather than throwing. Must be called while a
 * component is being set up.
 */
export const getInteractionSettingsContext = (): InteractionSettingsContextType =>
    hasContext() ? getContext() : InteractionSettingsUtils.UNPROVIDED_CONTEXT;
