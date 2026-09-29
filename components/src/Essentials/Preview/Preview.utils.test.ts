import { describe, expect, it } from "vitest";

import { PreviewUtils } from "./Preview.utils";

const COLLAPSED_HEIGHT = 120;

describe("computeIsOverflowing", () => {
    it("has something to open only when the content is taller than the cut", () => {
        expect(PreviewUtils.computeIsOverflowing(300, COLLAPSED_HEIGHT)).toBe(true);
        expect(PreviewUtils.computeIsOverflowing(80, COLLAPSED_HEIGHT)).toBe(false);
    });

    it("reads content not yet measured as fitting", () => {
        expect(PreviewUtils.computeIsOverflowing(0, COLLAPSED_HEIGHT)).toBe(false);
    });
});

describe("computeHeight", () => {
    it("holds the cut before anything is measured", () => {
        expect(PreviewUtils.computeHeight(0, COLLAPSED_HEIGHT, 1)).toBe(COLLAPSED_HEIGHT);
    });

    it("cuts overflowing content while shut and opens it to its own height", () => {
        expect(PreviewUtils.computeHeight(300, COLLAPSED_HEIGHT, 0)).toBe(COLLAPSED_HEIGHT);
        expect(PreviewUtils.computeHeight(300, COLLAPSED_HEIGHT, 1)).toBe(300);
    });

    it("gives content that fits only the room it needs", () => {
        expect(PreviewUtils.computeHeight(80, COLLAPSED_HEIGHT, 0)).toBe(80);
    });
});

describe("computeOverlayTarget", () => {
    it("shows the fade while the content is shut, and hides it while open", () => {
        expect(PreviewUtils.computeOverlayTarget(0)).toBe(1);
        expect(PreviewUtils.computeOverlayTarget(1)).toBe(0);
    });
});
