import type { ResolvedInteractionSettings } from "./InteractionSettings.types";

export type InteractionSettingsContextType = {
    getSettings: () => ResolvedInteractionSettings;
};
