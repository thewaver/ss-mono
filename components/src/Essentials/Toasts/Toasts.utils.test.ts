import { describe, expect, it } from "vitest";

import { ToastUtils } from "./Toasts.utils";

describe("computeStackAlignment", () => {
    it("maps a corner onto both flex axes for a plain column", () => {
        expect(ToastUtils.computeStackAlignment("bottom-right", "column")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("keeps the same corner when the column is reversed, by flipping the main axis alone", () => {
        expect(ToastUtils.computeStackAlignment("bottom-right", "column-reverse")).toEqual({
            justifyContent: "flex-start",
            alignItems: "flex-end",
        });
    });

    it("swaps which axis each half of the alignment drives for a row", () => {
        expect(ToastUtils.computeStackAlignment("top-center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("leaves a centered main axis alone when reversed, since center has no opposite", () => {
        expect(ToastUtils.computeStackAlignment("top-center", "row-reverse")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("flips the horizontal half for a reversed row", () => {
        expect(ToastUtils.computeStackAlignment("bottom-left", "row-reverse")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("reads middle and center as the same edge on whichever axis they land", () => {
        expect(ToastUtils.computeStackAlignment("middle-left", "column")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
        expect(ToastUtils.computeStackAlignment("middle-center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "center",
        });
    });
});

describe("computeSwipeDirection", () => {
    it("sends a toast off the side it sits against, corners included", () => {
        expect(ToastUtils.computeSwipeDirection("bottom-right")).toBe("right");
        expect(ToastUtils.computeSwipeDirection("top-left")).toBe("left");
        expect(ToastUtils.computeSwipeDirection("middle-right")).toBe("right");
    });

    it("sends a toast centered along the top or bottom off that edge", () => {
        expect(ToastUtils.computeSwipeDirection("top-center")).toBe("up");
        expect(ToastUtils.computeSwipeDirection("bottom-center")).toBe("down");
    });

    it("has no way off for a stack in the middle of the screen", () => {
        expect(ToastUtils.computeSwipeDirection("middle-center")).toBeUndefined();
    });
});
