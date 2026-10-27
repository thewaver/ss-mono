import { createContext, useContext } from "react";

import { type InteractionSettingsContextType, InteractionSettingsUtils } from "@thewaver/ss-components";

const InteractionSettingsContext = createContext<InteractionSettingsContextType | undefined>(undefined);

export const InteractionSettingsContextProvider = InteractionSettingsContext.Provider;

/**
 * Reads the settings that apply here: those of the nearest enclosing {@link InteractionSettings}, merged over the ones
 * above it.
 *
 * Outside any wrapper it answers with every setting at its default rather than throwing.
 */
export const useInteractionSettingsContext = (): InteractionSettingsContextType =>
    useContext(InteractionSettingsContext) ?? InteractionSettingsUtils.UNPROVIDED_CONTEXT;
