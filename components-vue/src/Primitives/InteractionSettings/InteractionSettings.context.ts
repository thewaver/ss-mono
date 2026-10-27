import { type InjectionKey, inject, provide } from "vue";

import { type InteractionSettingsContextType, InteractionSettingsUtils } from "@thewaver/ss-components";

const INTERACTION_SETTINGS_CONTEXT_KEY: InjectionKey<InteractionSettingsContextType> =
    Symbol("InteractionSettingsContext");

export const provideInteractionSettingsContext = (context: InteractionSettingsContextType) =>
    provide(INTERACTION_SETTINGS_CONTEXT_KEY, context);

/**
 * Reads the settings that apply here: those of the nearest enclosing {@link InteractionSettings}, merged over the ones
 * above it.
 *
 * Outside any wrapper it answers with every setting at its default rather than throwing.
 */
export const useInteractionSettingsContext = (): InteractionSettingsContextType =>
    inject(INTERACTION_SETTINGS_CONTEXT_KEY, undefined) ?? InteractionSettingsUtils.UNPROVIDED_CONTEXT;
