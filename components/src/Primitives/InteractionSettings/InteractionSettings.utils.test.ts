import { describe, expect, it } from "vitest";

import { INTERACTION_SETTINGS_DEFAULTS } from "./InteractionSettings.const";
import { InteractionSettingsUtils } from "./InteractionSettings.utils";

const OTHER_KEYS = { forward: { key: "F9" }, back: { key: "F9", modifiers: ["shift" as const] } };

describe("merge", () => {
    it("keeps what it inherits when a setting is left out", () => {
        const parent = { toastHotkeys: OTHER_KEYS };

        expect(InteractionSettingsUtils.merge(parent, {}).toastHotkeys).toBe(OTHER_KEYS);
    });

    it("replaces what it inherits when a setting is set again", () => {
        const own = { forward: { key: "F10" }, back: { key: "F11" } };

        expect(
            InteractionSettingsUtils.merge({ toastHotkeys: OTHER_KEYS }, { toastHotkeys: own }).toastHotkeys,
            "an object replaces the inherited one whole, with nothing of the parent's left in it",
        ).toBe(own);
    });

    it("takes null as a value that switches the setting off", () => {
        expect(
            InteractionSettingsUtils.merge(INTERACTION_SETTINGS_DEFAULTS, { toastHotkeys: null }).toastHotkeys,
        ).toBeNull();
    });

    it("lets a setting come back after an enclosing wrapper switched it off", () => {
        const off = InteractionSettingsUtils.merge(INTERACTION_SETTINGS_DEFAULTS, { toastHotkeys: null });

        expect(InteractionSettingsUtils.merge(off, { toastHotkeys: OTHER_KEYS }).toastHotkeys).toBe(OTHER_KEYS);
    });
});

describe("UNPROVIDED_CONTEXT", () => {
    it("answers the defaults", () => {
        expect(InteractionSettingsUtils.UNPROVIDED_CONTEXT.getSettings()).toBe(INTERACTION_SETTINGS_DEFAULTS);
    });
});

describe("computeHotkeysSignature", () => {
    it("is equal for pairs that fire on the same presses, whatever the case of the letter", () => {
        const lower = {
            forward: { key: "k", modifiers: ["ctrl" as const] },
            back: { key: "j", modifiers: ["ctrl" as const] },
        };
        const upper = {
            forward: { key: "K", modifiers: ["ctrl" as const] },
            back: { key: "J", modifiers: ["ctrl" as const] },
        };

        expect(InteractionSettingsUtils.computeHotkeysSignature(lower)).toBe(
            InteractionSettingsUtils.computeHotkeysSignature(upper),
        );
    });

    it("differs between pairs, and is undefined for none", () => {
        expect(InteractionSettingsUtils.computeHotkeysSignature(OTHER_KEYS)).not.toBe(
            InteractionSettingsUtils.computeHotkeysSignature(INTERACTION_SETTINGS_DEFAULTS.toastHotkeys),
        );
        expect(InteractionSettingsUtils.computeHotkeysSignature(null)).toBeUndefined();
    });
});

describe("getAreHotkeysEqual", () => {
    it("treats two nones as equal and a none and a pair as different", () => {
        expect(InteractionSettingsUtils.getAreHotkeysEqual(null, null)).toBe(true);
        expect(InteractionSettingsUtils.getAreHotkeysEqual(null, OTHER_KEYS)).toBe(false);
        expect(InteractionSettingsUtils.getAreHotkeysEqual(OTHER_KEYS, { ...OTHER_KEYS })).toBe(true);
    });
});
