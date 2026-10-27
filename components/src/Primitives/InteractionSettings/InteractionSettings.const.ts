import type { ResolvedInteractionSettings } from "./InteractionSettings.types";

export const INTERACTION_SETTINGS_DEFAULTS = {
    toastHotkeys: { forward: { key: "F8" }, back: { key: "F8", modifiers: ["shift"] } },
} satisfies ResolvedInteractionSettings;
