import { describe, expect, it } from "vitest";

import { SpineUtils } from "./Spine.utils";

const COUNT = 8;

const at = (distance: number, count = COUNT) => ({ distance, index: 0, count });

describe("radial", () => {
    it("lays the current face flat on the box and spaces the rest evenly round a whole turn", () => {
        expect(SpineUtils.radial(at(0))).toBe(0);
        expect(SpineUtils.radial(at(1))).toBe(45);
        expect(SpineUtils.radial(at(2))).toBe(90);
        expect(SpineUtils.radial(at(-1))).toBe(-45);
    });

    it("puts the face half a wheel away flat on the other side", () => {
        expect(SpineUtils.radial(at(COUNT * 0.5))).toBe(180);
    });

    it("turns smoothly between two faces, so a moving position animates", () => {
        expect(SpineUtils.radial(at(0.5))).toBe(22.5);
    });

    it("spreads the faces over less than a turn when asked for a fan", () => {
        const fan = SpineUtils.createRadial({ spanDegrees: 180 });

        expect(fan(at(COUNT))).toBe(180);
        expect(fan(at(COUNT * 0.5))).toBe(90);
    });

    it("answers flat for a spine with no faces rather than dividing by nothing", () => {
        expect(SpineUtils.radial(at(3, 0))).toBe(0);
    });
});

describe("leaves", () => {
    it("lays the faces still to come flat on the box, the current one among them", () => {
        expect(SpineUtils.leaves(at(0))).toBe(0);
        expect(SpineUtils.leaves(at(3))).toBe(0);
    });

    it("lays the faces already passed flat on the other side", () => {
        expect(SpineUtils.leaves(at(-1))).toBe(180);
        expect(SpineUtils.leaves(at(-4))).toBe(180);
    });

    it("turns the one face between by how far through the turn it is", () => {
        expect(SpineUtils.leaves(at(-0.25))).toBe(45);
        expect(SpineUtils.leaves(at(-0.5))).toBe(90);
    });
});

describe("getTurn", () => {
    it("turns about the upright spine across and the level one up and down, leading half towards the viewer", () => {
        expect(SpineUtils.getTurn("row", 30)).toEqual({ rotateY: -30 });
        expect(SpineUtils.getTurn("column", 30)).toEqual({ rotateX: -30 });
    });
});

describe("getLeadDepth", () => {
    it("is nothing for a face lying flat on either side, and greatest pointing at the viewer", () => {
        expect(SpineUtils.getLeadDepth(0)).toBe(0);
        expect(SpineUtils.getLeadDepth(180)).toBeCloseTo(0);
        expect(SpineUtils.getLeadDepth(90)).toBe(1);
        expect(SpineUtils.getLeadDepth(-90)).toBe(-1);
    });

    it("puts a face swung towards the viewer above one swung away", () => {
        expect(SpineUtils.getLeadDepth(60)).toBeGreaterThan(SpineUtils.getLeadDepth(-60));
    });
});

describe("getIsTurnedAway", () => {
    it("shows the front of a face less than a quarter turn from flat, and hides its back", () => {
        expect(SpineUtils.getIsTurnedAway(30, "front")).toBe(false);
        expect(SpineUtils.getIsTurnedAway(30, "back")).toBe(true);
    });

    it("shows the back of a face that has gone over, and hides its front", () => {
        expect(SpineUtils.getIsTurnedAway(180, "front")).toBe(true);
        expect(SpineUtils.getIsTurnedAway(180, "back")).toBe(false);
    });

    it("shows neither side edge-on", () => {
        expect(SpineUtils.getIsTurnedAway(90, "front")).toBe(true);
        expect(SpineUtils.getIsTurnedAway(90, "back")).toBe(true);
    });

    it("reads an angle however many turns it has gathered, either way round", () => {
        expect(SpineUtils.getIsTurnedAway(-30, "front")).toBe(false);
        expect(SpineUtils.getIsTurnedAway(390, "front")).toBe(false);
        expect(SpineUtils.getIsTurnedAway(-180, "back")).toBe(false);
    });
});

describe("getStackOffset", () => {
    it("leaves the current face where it is and pushes the others back the further they are", () => {
        expect(SpineUtils.getStackOffset(0, COUNT)).toBeCloseTo(0);
        expect(SpineUtils.getStackOffset(2, COUNT)).toBeLessThan(SpineUtils.getStackOffset(1, COUNT));
    });

    it("puts the face that went over last on top of the ones before it", () => {
        expect(SpineUtils.getStackOffset(-1, COUNT)).toBeGreaterThan(SpineUtils.getStackOffset(-2, COUNT));
    });

    it("pushes a face no further than the face count, however far the position has run", () => {
        expect(SpineUtils.getStackOffset(50, COUNT)).toBe(SpineUtils.getStackOffset(COUNT, COUNT));
    });
});

describe("getFaceTransform", () => {
    it("pushes the face back before swinging it round the spine", () => {
        expect(SpineUtils.getFaceTransform("row", "front", 30, -0.5)).toBe("translateZ(-0.5px) rotateY(-30deg)");
        expect(SpineUtils.getFaceTransform("column", "front", 30, 0)).toBe("translateZ(0px) rotateX(-30deg)");
    });

    it("turns a back a further half turn about the same spine", () => {
        expect(SpineUtils.getFaceTransform("row", "back", 30, 0)).toBe(
            "translateZ(0px) rotateY(-30deg) rotateY(180deg)",
        );
        expect(SpineUtils.getFaceTransform("column", "back", 30, 0)).toBe(
            "translateZ(0px) rotateX(-30deg) rotateX(180deg)",
        );
    });
});
