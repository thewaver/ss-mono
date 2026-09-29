import { describe, expect, it } from "vitest";

import { ColorInputUtils } from "./ColorInput.utils";

describe("computeStartingState", () => {
    it("parses a readable value and keeps its notation", () => {
        const state = ColorInputUtils.computeStartingState("#3366ff");

        expect(state.isUnreadable).toBe(false);
        expect(state.notation).toBe("hex");
        expect(ColorInputUtils.toValue(state.hsv, state.notation)).toBe("#3366ff");
    });

    it("starts from black and says so when the value cannot be read", () => {
        const state = ColorInputUtils.computeStartingState("not a color");

        expect(state.isUnreadable).toBe(true);
        expect(state.hsv).toEqual(ColorInputUtils.STARTING_COLOR);
        expect(state.notation).toBe(ColorInputUtils.DEFAULT_NOTATION);
    });
});

describe("computeIncoming", () => {
    it("changes only the flag for a value it cannot read", () => {
        expect(ColorInputUtils.computeIncoming("nope", ColorInputUtils.STARTING_COLOR)).toEqual({
            isUnreadable: true,
            notation: undefined,
            hsv: undefined,
        });
    });

    it("keeps the color it holds when the value is the same color coming back", () => {
        const held = ColorInputUtils.computeStartingState("#3366ff").hsv;

        expect(ColorInputUtils.computeIncoming("#3366FF", held).hsv).toBeUndefined();
    });

    it("takes a different color", () => {
        const held = ColorInputUtils.computeStartingState("#3366ff").hsv;
        const incoming = ColorInputUtils.computeIncoming("#ff0055", held);

        expect(incoming.hsv).toBeDefined();
        expect(ColorInputUtils.toValue(incoming.hsv!, incoming.notation!)).toBe("#ff0055");
    });
});

describe("computeOutgoing", () => {
    const hsv = ColorInputUtils.computeStartingState("#ff0055").hsv;

    it("writes the color in the notation held", () => {
        expect(ColorInputUtils.computeOutgoing(hsv, "hex", "#3366ff", false)).toBe("#ff0055");
    });

    it("writes nothing when the consumer already holds that color", () => {
        expect(ColorInputUtils.computeOutgoing(hsv, "hex", "#ff0055", false)).toBeUndefined();
    });

    it("writes nothing over a value it could not read", () => {
        expect(ColorInputUtils.computeOutgoing(hsv, "hex", "nope", true)).toBeUndefined();
    });
});
