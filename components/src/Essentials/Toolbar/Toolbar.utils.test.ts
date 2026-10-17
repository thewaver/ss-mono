import { describe, expect, it } from "vitest";

import { ToolbarUtils } from "./Toolbar.utils";

describe("the row's walk", () => {
    const actions = [{ value: "a" }, { value: "b", isDisabled: true }, { value: "c" }, { value: "d" }];
    const stops = ToolbarUtils.computeStops(actions, [0, 1, 2]);
    const OVERFLOW = ToolbarUtils.OVERFLOW_STOP;

    const keyDefs = { isFromRow: true, stops, hasOverflow: true, openStop: undefined, rovingStop: 0, isPlaced: false };

    it("stops at the shown actions that are not disabled", () => {
        expect(stops).toEqual([0, 2]);
    });

    it("holds the tab stop where focus was, and on the first action otherwise", () => {
        expect(ToolbarUtils.computeRovingStop(stops, 2, true)).toBe(2);
        expect(ToolbarUtils.computeRovingStop(stops, 3, true), "a collapsed action no longer holds it").toBe(0);
        expect(ToolbarUtils.computeRovingStop([], undefined, true)).toBe(OVERFLOW);
    });

    it("sends focus after an action that collapsed, into the overflow button it went into", () => {
        expect(ToolbarUtils.computeFocusLanding(stops, 3, true)).toEqual({ landing: OVERFLOW });
        expect(ToolbarUtils.computeFocusLanding(stops, 3, false)).toEqual({ landing: 0 });
        expect(ToolbarUtils.computeFocusLanding(stops, 2, true)).toBeUndefined();
    });

    it("walks the stops with the overflow button last, wrapping, and reads the arrows the way the text runs", () => {
        expect(ToolbarUtils.computeKeyStep("ArrowRight", { ...keyDefs, direction: "ltr" })).toEqual({
            stop: 2,
            isSwitch: false,
        });
        expect(ToolbarUtils.computeKeyStep("ArrowLeft", { ...keyDefs, direction: "ltr" })).toEqual({
            stop: OVERFLOW,
            isSwitch: false,
        });
        expect(ToolbarUtils.computeKeyStep("ArrowLeft", { ...keyDefs, direction: "rtl" })).toEqual({
            stop: 2,
            isSwitch: false,
        });
    });

    it("leaves a key from an open menu alone unless it is a menubar's switch", () => {
        const fromMenu = { ...keyDefs, isFromRow: false, direction: "ltr" as const };

        expect(ToolbarUtils.computeKeyStep("ArrowRight", fromMenu)).toBeUndefined();
        expect(ToolbarUtils.computeKeyStep("ArrowRight", { ...fromMenu, openStop: 0 })).toEqual({
            stop: 2,
            isSwitch: true,
        });
        expect(ToolbarUtils.computeKeyStep("End", { ...fromMenu, openStop: 0 })).toBeUndefined();
    });

    it("keeps one menu open, and ignores a late close from a menu already switched away from", () => {
        expect(ToolbarUtils.computeNextOpenStop(0, 2, true)).toBe(2);
        expect(ToolbarUtils.computeNextOpenStop(2, 0, false)).toBe(2);
        expect(ToolbarUtils.computeNextOpenStop(2, 2, false)).toBeUndefined();
    });

    it("hands a collapsed action to the menu as a checkbox when the actions are pressable", () => {
        expect(ToolbarUtils.computeOverflowItems(actions, [3], { hasSubmenus: false, isPressable: true })).toEqual([
            { value: "d", kind: "checkbox", isDisabled: undefined, isReachableWhenDisabled: undefined },
        ]);
        expect(
            ToolbarUtils.computeOverflowItems([{ value: "file", items: [{ value: "new" }] }], [0], {
                hasSubmenus: true,
                isPressable: false,
            })[0].items,
        ).toEqual([{ value: "new" }]);
    });
});
