import { describe, expect, it, vi } from "vitest";

import type { Tab } from "./Tabs.types";
import { TabsUtils } from "./Tabs.utils";

const TABS: Tab<string>[] = [
    { value: "one" },
    { value: "two" },
    { value: "three", isDisabled: true },
    { value: "four" },
];

const REACHABLE: Tab<string>[] = TABS.map((tab) => (tab.isDisabled ? { ...tab, isReachableWhenDisabled: true } : tab));

const ALL_DISABLED: Tab<string>[] = TABS.map((tab) => ({ ...tab, isDisabled: true }));

const step = (key: string, tabs: Tab<string>[], opts?: { focusedValue?: string; hasAutoActivation?: boolean }) =>
    TabsUtils.computeKeyStep(key, tabs, {
        selectedValue: "one",
        focusedValue: opts?.focusedValue,
        orientation: "horizontal",
        direction: "ltr",
        hasAutoActivation: opts?.hasAutoActivation ?? false,
    });

describe("computeSelectedIndex", () => {
    it("finds the selected tab by identity, and answers -1 for nothing", () => {
        expect(TabsUtils.computeSelectedIndex(TABS, "four")).toBe(3);
        expect(TabsUtils.computeSelectedIndex(TABS, undefined)).toBe(-1);
    });
});

describe("computeNavigableIndexes", () => {
    it("leaves a disabled tab out of the walk unless it asked to stay reachable", () => {
        expect(TabsUtils.computeNavigableIndexes(TABS)).toEqual([0, 1, 3]);
        expect(TabsUtils.computeNavigableIndexes(REACHABLE)).toEqual([0, 1, 2, 3]);
    });
});

describe("computeRovingIndex", () => {
    it("puts the tab stop on the tab the arrows last reached, then on the selection, then on the first", () => {
        expect(TabsUtils.computeRovingIndex(TABS, "one", "four")).toBe(3);
        expect(TabsUtils.computeRovingIndex(TABS, "two", undefined)).toBe(1);
        expect(TabsUtils.computeRovingIndex(TABS, "three", undefined)).toBe(0);
    });

    it("finds nowhere for it when nothing can take focus", () => {
        expect(TabsUtils.computeRovingIndex(ALL_DISABLED, "one", undefined)).toBeUndefined();
    });
});

describe("computeKeyStep", () => {
    it("walks forward over the disabled tab and wraps at the end", () => {
        expect(step("ArrowRight", TABS, { focusedValue: "two" })?.index).toBe(3);
        expect(step("ArrowRight", TABS, { focusedValue: "four" })?.index).toBe(0);
    });

    it("leaves a key alone that means nothing to the strip", () => {
        expect(step("ArrowDown", TABS)).toBeUndefined();
        expect(step("ArrowRight", ALL_DISABLED)).toBeUndefined();
    });

    it("selects on arrival only when activation is automatic", () => {
        expect(step("ArrowRight", TABS)?.isSelecting).toBe(false);
        expect(step("ArrowRight", TABS, { hasAutoActivation: true })).toEqual({
            index: 1,
            value: "two",
            isSelecting: true,
        });
    });

    it("never selects a disabled tab it landed on, even automatically", () => {
        expect(step("ArrowRight", REACHABLE, { focusedValue: "two", hasAutoActivation: true })).toEqual({
            index: 2,
            value: "three",
            isSelecting: false,
        });
    });
});

describe("warnIfUnpaired", () => {
    const warnWith = (tabs: Tab<string>[]) => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        TabsUtils.warnIfUnpaired(tabs);

        const calls = warn.mock.calls.length;
        const message = String(warn.mock.calls[0]?.[0] ?? "");

        warn.mockRestore();

        return { calls, message };
    };

    it("says nothing when every tab names its panel and is named back", () => {
        expect(warnWith(TABS.map((tab) => ({ ...tab, id: `t-${tab.value}`, panelId: `p-${tab.value}` }))).calls).toBe(
            0,
        );
    });

    it("warns once, naming the positions of the tabs missing either half of the pair", () => {
        const { calls, message } = warnWith([
            { value: "one", id: "t1", panelId: "p1" },
            { value: "two", id: "t2" },
            { value: "three", panelId: "p3" },
            { value: "four" },
        ]);

        expect(calls).toBe(1);
        expect(message).toContain("1, 2, 3");
    });

    it("leaves out a tab that navigates by href", () => {
        expect(warnWith([{ value: "docs", href: "#docs" }]).calls).toBe(0);
    });

    it("still counts a disabled tab, which will need its panel the moment it is enabled", () => {
        expect(warnWith([{ value: "one", isDisabled: true }]).calls).toBe(1);
    });
});
