import { describe, expect, it } from "vitest";

import { ImageSwitcherUtils } from "./ImageSwitcher.utils";

describe("ImageSwitcherUtils.getLayers", () => {
    it("flips which element is shown with each swap, and the other keeps the outgoing picture", () => {
        expect(ImageSwitcherUtils.getLayers({ prevSrc: "a", currentSrc: "b", version: 1 })).toEqual([
            { src: "a", isShown: false },
            { src: "b", isShown: true },
        ]);
        expect(ImageSwitcherUtils.getLayers({ prevSrc: "b", currentSrc: "c", version: 2 })).toEqual([
            { src: "c", isShown: true },
            { src: "b", isShown: false },
        ]);
    });
});
