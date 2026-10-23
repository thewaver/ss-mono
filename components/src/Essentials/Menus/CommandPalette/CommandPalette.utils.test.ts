import { describe, expect, it } from "vitest";

import type { CommandPaletteItemRecord } from "./CommandPalette.types";
import { CommandPaletteUtils } from "./CommandPalette.utils";

const ITEMS: CommandPaletteItemRecord<string>[] = [
    { value: "open", shortcut: { key: "o", modifiers: ["mod"] } },
    { value: "about" },
    {
        label: "Edit",
        options: [
            { value: "undo", shortcut: { key: "z", modifiers: ["mod"] } },
            { value: "redo", shortcut: { key: "z", modifiers: ["mod", "shift"] }, isDisabled: true },
            { value: "select" },
        ],
    },
    { label: "Empty", options: [] },
];

describe("getBoundActions", () => {
    it("takes every enabled action that has a shortcut, from inside groups too, in the order shown", () => {
        expect(CommandPaletteUtils.getBoundActions(ITEMS).map((action) => action.value)).toEqual(["open", "undo"]);
    });

    it("leaves a disabled action out even though it has a shortcut", () => {
        expect(CommandPaletteUtils.getBoundActions(ITEMS).some((action) => action.value === "redo")).toBe(false);
    });

    it("finds nothing in an empty list", () => {
        expect(CommandPaletteUtils.getBoundActions([])).toEqual([]);
    });
});
