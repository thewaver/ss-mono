import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DismisserLayerDefs } from "../Dismisser/Dismisser.types";
import type { Shortcut, ShortcutKeyEvent } from "./Shortcut.types";
import { ShortcutUtils } from "./Shortcut.utils";

const press = (key: string, held: Partial<Omit<ShortcutKeyEvent, "key">> = {}): ShortcutKeyEvent => ({
    key,
    code: "",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    ...held,
});

describe("resolve", () => {
    it("turns mod into Command on an Apple platform and Control elsewhere", () => {
        expect(ShortcutUtils.resolve({ key: "k", modifiers: ["mod"] }, true).modifiers).toEqual(["meta"]);
        expect(ShortcutUtils.resolve({ key: "k", modifiers: ["mod"] }, false).modifiers).toEqual(["ctrl"]);
    });

    it("orders the modifiers one way whatever order they were given in, and keeps a repeated one once", () => {
        const given = ShortcutUtils.resolve({ key: "k", modifiers: ["shift", "mod", "alt", "ctrl"] }, false);

        expect(given.modifiers).toEqual(["ctrl", "alt", "shift"]);
        expect(ShortcutUtils.resolve({ key: "k", modifiers: ["mod", "shift"] }, true).modifiers).toEqual(
            ShortcutUtils.resolve({ key: "k", modifiers: ["shift", "mod"] }, true).modifiers,
        );
    });

    it("hands the key back as it was given and an absent list as no modifiers", () => {
        expect(ShortcutUtils.resolve({ key: "F8" }, false)).toEqual({ key: "F8", modifiers: [] });
    });
});

describe("computeIsMatch", () => {
    it("matches mod against the platform's own key only", () => {
        const shortcut = { key: "k", modifiers: ["mod" as const] };

        expect(ShortcutUtils.computeIsMatch(shortcut, press("k", { metaKey: true }), true)).toBe(true);
        expect(ShortcutUtils.computeIsMatch(shortcut, press("k", { ctrlKey: true }), true)).toBe(false);
        expect(ShortcutUtils.computeIsMatch(shortcut, press("k", { ctrlKey: true }), false)).toBe(true);
        expect(ShortcutUtils.computeIsMatch(shortcut, press("k", { metaKey: true }), false)).toBe(false);
    });

    it("ignores letter case, so Shift held over a letter is still told apart only by the modifiers", () => {
        const shortcut = { key: "k", modifiers: ["ctrl" as const, "shift" as const] };

        expect(ShortcutUtils.computeIsMatch(shortcut, press("K", { ctrlKey: true, shiftKey: true }), false)).toBe(true);
        expect(ShortcutUtils.computeIsMatch(shortcut, press("k", { ctrlKey: true }), false)).toBe(false);
        expect(ShortcutUtils.computeIsMatch({ key: "K" }, press("k"), false)).toBe(true);
    });

    it("refuses a press holding a modifier the shortcut did not ask for", () => {
        expect(
            ShortcutUtils.computeIsMatch(
                { key: "k", modifiers: ["ctrl"] },
                press("k", { ctrlKey: true, altKey: true }),
                false,
            ),
        ).toBe(false);
        expect(ShortcutUtils.computeIsMatch({ key: "ArrowUp" }, press("ArrowUp", { shiftKey: true }), false)).toBe(
            false,
        );
    });

    it("leaves Shift uncompared for a symbol or digit, since the layout decides whether typing it needs Shift", () => {
        expect(ShortcutUtils.computeIsMatch({ key: "?" }, press("?", { shiftKey: true }), false)).toBe(true);
        expect(
            ShortcutUtils.computeIsMatch(
                { key: "1", modifiers: ["alt"] },
                press("1", { altKey: true, shiftKey: true }),
                false,
            ),
        ).toBe(true);
        expect(
            ShortcutUtils.computeIsMatch({ key: "?", modifiers: ["shift"] }, press("?"), false),
            "asked for, it is required",
        ).toBe(false);
    });

    it("falls back to the physical key when the press types no plain character", () => {
        const shortcut = { key: "k", modifiers: ["alt" as const] };

        expect(ShortcutUtils.computeIsMatch(shortcut, press("˚", { code: "KeyK", altKey: true }), true)).toBe(true);
        expect(
            ShortcutUtils.computeIsMatch(
                { key: "k", modifiers: ["ctrl"] },
                press("л", { code: "KeyK", ctrlKey: true }),
                false,
            ),
        ).toBe(true);
        expect(
            ShortcutUtils.computeIsMatch(
                { key: "2", modifiers: ["alt"] },
                press("™", { code: "Digit2", altKey: true }),
                true,
            ),
        ).toBe(true);
    });

    it("never falls back when the press typed a plain character, so a remapped layout keeps its own letters", () => {
        expect(ShortcutUtils.computeIsMatch({ key: "q" }, press("a", { code: "KeyQ" }), false)).toBe(false);
    });
});

describe("getIsCharacterKey", () => {
    it("is a single character with no modifier but Shift", () => {
        expect(ShortcutUtils.getIsCharacterKey({ key: "g" })).toBe(true);
        expect(ShortcutUtils.getIsCharacterKey({ key: "?" })).toBe(true);
        expect(ShortcutUtils.getIsCharacterKey({ key: "G", modifiers: ["shift"] })).toBe(true);
    });

    it("is not a named key, nor a character held with any other modifier", () => {
        expect(ShortcutUtils.getIsCharacterKey({ key: "F8" })).toBe(false);
        expect(ShortcutUtils.getIsCharacterKey({ key: "g", modifiers: ["mod"] })).toBe(false);
        expect(ShortcutUtils.getIsCharacterKey({ key: "g", modifiers: ["shift", "alt"] })).toBe(false);
    });
});

describe("computeSignature", () => {
    it("is equal for two shortcuts one press would fire", () => {
        expect(ShortcutUtils.computeSignature({ key: "K", modifiers: ["mod"] }, true)).toBe(
            ShortcutUtils.computeSignature({ key: "k", modifiers: ["meta"] }, true),
        );
        expect(ShortcutUtils.computeSignature({ key: "k", modifiers: ["mod"] }, false)).toBe("ctrl+k");
    });

    it("differs once the platform reads mod differently", () => {
        expect(ShortcutUtils.computeSignature({ key: "k", modifiers: ["mod"] }, false)).not.toBe(
            ShortcutUtils.computeSignature({ key: "k", modifiers: ["meta"] }, false),
        );
    });
});

/**
 * `addBinding` needs a document only to listen on, so a stand-in that records `addEventListener` and
 * `removeEventListener` is honest here: nothing about a key press's geometry is faked. Each case uses its own keys,
 * since a warning prints once per message for the life of the module.
 */
describe("addBinding", () => {
    const listened = { added: 0, removed: 0 };
    const removers: (() => void)[] = [];
    const warnings: string[] = [];

    const bind = (shortcut: Shortcut, layer?: DismisserLayerDefs) => {
        const remove = ShortcutUtils.addBinding({ shortcut, onTrigger: () => {}, layer });

        removers.push(remove);

        return remove;
    };

    const warningsNaming = (shortcut: Shortcut) =>
        warnings.filter((message) => message.includes(`"${ShortcutUtils.computeSignature(shortcut)}"`)).length;

    const layer = (): DismisserLayerDefs => ({ getRoots: () => [], onDismiss: () => {} });

    beforeEach(() => {
        listened.added = 0;
        listened.removed = 0;
        warnings.length = 0;
        vi.spyOn(console, "warn").mockImplementation((message) => {
            warnings.push(String(message));
        });
        vi.stubGlobal("document", {
            addEventListener: () => listened.added++,
            removeEventListener: () => listened.removed++,
        });
    });

    afterEach(() => {
        removers.splice(0).forEach((remove) => remove());
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("warns about a character key shortcut, naming it, and only once however often it is registered", () => {
        const shortcut: Shortcut = { key: "q" };

        bind(shortcut)();
        bind(shortcut)();

        expect(warningsNaming(shortcut)).toBe(1);
    });

    it("says nothing about a shortcut held with a modifier", () => {
        const shortcut: Shortcut = { key: "j", modifiers: ["alt"] };

        bind(shortcut);

        expect(warningsNaming(shortcut)).toBe(0);
    });

    it("warns when one shortcut is registered twice on the same layer", () => {
        const shortcut: Shortcut = { key: "u", modifiers: ["ctrl"] };
        const shared = layer();

        bind(shortcut, shared);
        bind(shortcut, shared);

        expect(warningsNaming(shortcut)).toBe(1);
    });

    it("says nothing when the same shortcut is registered on two different layers", () => {
        const shortcut: Shortcut = { key: "y", modifiers: ["ctrl"] };

        bind(shortcut, layer());
        bind(shortcut, layer());

        expect(warningsNaming(shortcut)).toBe(0);
    });

    it("listens on the document with the first binding and stops with the last", () => {
        const first = bind({ key: "F2" });
        const second = bind({ key: "F3" });

        expect(listened.added, "one listener serves every binding").toBe(1);

        first();

        expect(listened.removed, "and it stays while a binding is left").toBe(0);

        second();
        second();

        expect(listened.removed, "it goes with the last, and removing twice is harmless").toBe(1);
    });
});
