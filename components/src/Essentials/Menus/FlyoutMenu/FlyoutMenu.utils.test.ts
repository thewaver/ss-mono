import { describe, expect, it } from "vitest";

import { FlyoutMenuUtils } from "./FlyoutMenu.utils";

describe("getHasPanel", () => {
    it("gives a panel only to an entry with links", () => {
        expect(FlyoutMenuUtils.getHasPanel({ value: "a", href: "/a" })).toBe(false);
        expect(FlyoutMenuUtils.getHasPanel({ value: "a", href: "/a", links: [] })).toBe(false);
        expect(FlyoutMenuUtils.getHasPanel({ value: "a", href: "/a", links: [{ value: "b", href: "/b" }] })).toBe(true);
    });
});

describe("computeNextOpenIndex", () => {
    it("keeps one entry open, and ignores a late close from one already left", () => {
        expect(FlyoutMenuUtils.computeNextOpenIndex(undefined, 1, true)).toBe(1);
        expect(FlyoutMenuUtils.computeNextOpenIndex(1, 2, true), "opening another moves the panel there").toBe(2);
        expect(FlyoutMenuUtils.computeNextOpenIndex(2, 1, false), "the one left closing late changes nothing").toBe(2);
        expect(FlyoutMenuUtils.computeNextOpenIndex(2, 2, false)).toBeUndefined();
    });
});

describe("getIsHoverSwitchRefused", () => {
    it("holds the panel where focus is working, and only then", () => {
        expect(FlyoutMenuUtils.getIsHoverSwitchRefused(1, 2, true)).toBe(true);
        expect(FlyoutMenuUtils.getIsHoverSwitchRefused(1, 2, false), "without focus inside it moves").toBe(false);
        expect(FlyoutMenuUtils.getIsHoverSwitchRefused(1, 1, true), "the open entry itself is no switch").toBe(false);
        expect(FlyoutMenuUtils.getIsHoverSwitchRefused(undefined, 2, true), "with nothing open").toBe(false);
    });
});

describe("computeCollapsedEntries", () => {
    it("hands over the collapsed entries in bar order, links and all", () => {
        const entries = [
            { value: "a", href: "/a" },
            { value: "b", href: "/b", links: [{ value: "c", href: "/c" }] },
            { value: "d", href: "/d" },
        ];

        expect(FlyoutMenuUtils.computeCollapsedEntries(entries, [1, 2])).toEqual([entries[1], entries[2]]);
    });
});
