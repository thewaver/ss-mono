import { describe, expect, it } from "vitest";

import { ModalUtils } from "./Modal.utils";

describe("swipe direction and axis", () => {
    it("sends an edge dialog back towards its own edge, along that edge's axis", () => {
        expect(ModalUtils.getSwipeDirection("left")).toBe("left");
        expect(ModalUtils.getSwipeDirection("top")).toBe("up");
        expect(ModalUtils.getSwipeAxis("right")).toBe("horizontal");
        expect(ModalUtils.getSwipeAxis("bottom")).toBe("vertical");
    });

    it("gives a centered dialog no direction, and an axis only so the tracker has one", () => {
        expect(ModalUtils.getSwipeDirection("center")).toBeUndefined();
        expect(ModalUtils.getSwipeAxis("center")).toBe("horizontal");
    });
});

describe("getIsSwipeDisabled", () => {
    it("switches the swipe off for a centered dialog and for one whose backdrop does not close it", () => {
        expect(ModalUtils.getIsSwipeDisabled("center", true)).toBe(true);
        expect(ModalUtils.getIsSwipeDisabled("left", false), "the single-pointer way out is gone too").toBe(true);
        expect(ModalUtils.getIsSwipeDisabled("left", true)).toBe(false);
    });
});

describe("getIsSwipeDismissal", () => {
    it("closes only on a swipe committed towards the dialog's own edge", () => {
        expect(ModalUtils.getIsSwipeDismissal("down", "bottom")).toBe(true);
        expect(ModalUtils.getIsSwipeDismissal("up", "bottom")).toBe(false);
        expect(ModalUtils.getIsSwipeDismissal(undefined, "bottom")).toBe(false);
        expect(ModalUtils.getIsSwipeDismissal(undefined, "center")).toBe(false);
    });
});

describe("computeSwipeTransform", () => {
    it("writes nothing at rest or for a dialog that cannot be swiped", () => {
        expect(ModalUtils.computeSwipeTransform("left", 0)).toBeUndefined();
        expect(ModalUtils.computeSwipeTransform("center", 0.5)).toBeUndefined();
    });

    it("moves towards the edge, negative for left and up", () => {
        expect(ModalUtils.computeSwipeTransform("left", 0.5)).toBe("translateX(-50%)");
        expect(ModalUtils.computeSwipeTransform("right", 0.25)).toBe("translateX(25%)");
        expect(ModalUtils.computeSwipeTransform("top", 0.5)).toBe("translateY(-50%)");
        expect(ModalUtils.computeSwipeTransform("bottom", 0.5)).toBe("translateY(50%)");
    });
});

describe("computeMaxSize", () => {
    it("caps the box at the room left between opposite margins", () => {
        expect(ModalUtils.computeMaxSize({ marginTop: 10, marginRight: 20, marginBottom: 30, marginLeft: 40 })).toEqual(
            { maxWidth: "calc(100% - 60px)", maxHeight: "calc(100% - 40px)" },
        );
    });
});

describe("getIsDismissedBy", () => {
    it("honors Escape alone, and only while the dialog allows it", () => {
        expect(ModalUtils.getIsDismissedBy("escape", true)).toBe(true);
        expect(ModalUtils.getIsDismissedBy("escape", false)).toBe(false);
        expect(ModalUtils.getIsDismissedBy("press", true)).toBe(false);
        expect(ModalUtils.getIsDismissedBy("focus", true)).toBe(false);
    });
});
