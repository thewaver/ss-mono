import { describe, expect, it } from "vitest";

import { PopoverUtils } from "./Popover.utils";

describe("computeAnchorPresence", () => {
    it("remembers nothing while the popup is closed or not pinned", () => {
        expect(PopoverUtils.computeAnchorPresence(true, false, true, false)).toEqual({
            hasSeenAnchor: false,
            isGone: false,
        });
        expect(PopoverUtils.computeAnchorPresence(true, true, false, false)).toEqual({
            hasSeenAnchor: false,
            isGone: false,
        });
    });

    it("records the anchor once it is on screen", () => {
        expect(PopoverUtils.computeAnchorPresence(false, true, true, true)).toEqual({
            hasSeenAnchor: true,
            isGone: false,
        });
    });

    it("does not give up on an anchor that has never been seen", () => {
        expect(PopoverUtils.computeAnchorPresence(false, true, true, false)).toEqual({
            hasSeenAnchor: false,
            isGone: false,
        });
    });

    it("gives up once a seen anchor has left the screen, and keeps saying so", () => {
        const first = PopoverUtils.computeAnchorPresence(true, true, true, false);

        expect(first).toEqual({ hasSeenAnchor: true, isGone: true });
        expect(PopoverUtils.computeAnchorPresence(first.hasSeenAnchor, true, true, false).isGone).toBe(true);
    });
});

describe("getIsFocusKeptOnPress", () => {
    it("keeps focus with the owner of a list or a menu, and lets a dialog take it", () => {
        expect(PopoverUtils.getIsFocusKeptOnPress("listbox")).toBe(true);
        expect(PopoverUtils.getIsFocusKeptOnPress("menu")).toBe(true);
        expect(PopoverUtils.getIsFocusKeptOnPress("dialog")).toBe(false);
    });
});
