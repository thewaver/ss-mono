import { describe, expect, it } from "vitest";

import { RGB_ANIMATION_CHANNELS } from "./RGBAnimation.const";
import { RGBAnimationUtils } from "./RGBAnimation.utils";

describe("resolveColorMixing", () => {
    it("is additive for a page that says it is dark, and subtractive for one that says it is light", () => {
        expect(RGBAnimationUtils.resolveColorMixing("dark", false)).toBe("additive");
        expect(RGBAnimationUtils.resolveColorMixing("dark", true)).toBe("additive");
        expect(RGBAnimationUtils.resolveColorMixing("light", false)).toBe("subtractive");
        expect(RGBAnimationUtils.resolveColorMixing("light", true)).toBe("subtractive");
    });

    it("lets the system setting decide when both are declared, whichever order they come in", () => {
        expect(RGBAnimationUtils.resolveColorMixing("light dark", true)).toBe("additive");
        expect(RGBAnimationUtils.resolveColorMixing("light dark", false)).toBe("subtractive");
        expect(RGBAnimationUtils.resolveColorMixing("dark light", true)).toBe("additive");
        expect(RGBAnimationUtils.resolveColorMixing("dark light", false)).toBe("subtractive");
    });

    it("reads past the word only", () => {
        expect(RGBAnimationUtils.resolveColorMixing("only dark", false)).toBe("additive");
        expect(RGBAnimationUtils.resolveColorMixing("only light", true)).toBe("subtractive");
    });

    it("treats a page that sets nothing as light, whatever the system asks for", () => {
        expect(RGBAnimationUtils.resolveColorMixing("normal", true)).toBe("subtractive");
        expect(RGBAnimationUtils.resolveColorMixing("", true)).toBe("subtractive");
    });
});

describe("readColorMixing", () => {
    it("is subtractive when there is no element to read", () => {
        expect(RGBAnimationUtils.readColorMixing(undefined)).toBe("subtractive");
    });
});

describe("computeChannelMatrix", () => {
    it("gives each channel a different matrix, and changes it with the mixing", () => {
        const additive = RGB_ANIMATION_CHANNELS.map((channel) =>
            RGBAnimationUtils.computeChannelMatrix(channel, "additive"),
        );
        const subtractive = RGB_ANIMATION_CHANNELS.map((channel) =>
            RGBAnimationUtils.computeChannelMatrix(channel, "subtractive"),
        );

        expect(new Set(additive).size).toBe(RGB_ANIMATION_CHANNELS.length);
        additive.forEach((matrix, index) => expect(matrix).not.toBe(subtractive[index]));
    });
});

describe("computeEvaluationDefs", () => {
    it("hands every channel the picture's size, in the order the channels are listed", () => {
        const size = { width: 200, height: 100 };
        const defs = RGBAnimationUtils.computeEvaluationDefs(size);

        expect(defs.map((d) => d.channel)).toEqual([...RGB_ANIMATION_CHANNELS]);
        defs.forEach((d) => expect(d.size).toEqual(size));
    });
});
