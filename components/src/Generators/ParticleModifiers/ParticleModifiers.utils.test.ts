import { describe, expect, it } from "vitest";

import type { ParticleTravelDefs } from "../../Exotics/Particles/ParticleSpawner/ParticleSpawner.types";
import { ParticleModifierUtils } from "./ParticleModifiers.utils";

const MID_LEG = 0.5;
const LEG_ENDS = [0, 1];
const TIMES_MS = [0, 137, 480, 1250, 9999];
const IDS = [0, 1, 7, 42];

const toTravel = (overrides: Partial<ParticleTravelDefs> = {}): ParticleTravelDefs => ({
    id: 0,
    index: 0,
    stop: 0,
    legIndex: 0,
    legCount: 1,
    origin: { x: 0, y: 0 },
    from: { x: 0, y: 0 },
    to: { x: 100, y: 0 },
    modMarkers: [],
    prefersReducedMotion: false,
    ...overrides,
});

const POS = { x: 10, y: 20 };

describe("ParticleModifierUtils.createWind", () => {
    it("leaves a particle on its stop at either end of a leg", () => {
        const wind = ParticleModifierUtils.createWind({ strengthPixels: 30 });

        for (const t of LEG_ENDS) {
            for (const ms of TIMES_MS) {
                const moved = wind(POS, toTravel(), t, ms);

                expect(moved.x).toBeCloseTo(POS.x);
                expect(moved.y).toBeCloseTo(POS.y);
            }
        }
    });

    it("moves nothing for a reader who asks for reduced motion", () => {
        const wind = ParticleModifierUtils.createWind({ strengthPixels: 30 });

        expect(wind(POS, toTravel({ prefersReducedMotion: true }), MID_LEG, 480)).toEqual(POS);
    });

    it("blows the way it is pointed, clockwise from rightward", () => {
        const wind = ParticleModifierUtils.createWind({ directionDegrees: 90, strengthPixels: 30, gustRatio: 0 });
        const moved = wind(POS, toTravel(), MID_LEG, 0);

        expect(moved.x).toBeCloseTo(POS.x);
        expect(moved.y).toBeGreaterThan(POS.y);
    });

    it("pushes by exactly its strength mid-leg when it does not gust, whenever and whoever", () => {
        const wind = ParticleModifierUtils.createWind({ directionDegrees: 0, strengthPixels: 30, gustRatio: 0 });

        for (const ms of TIMES_MS) {
            for (const id of IDS) {
                expect(wind(POS, toTravel({ id }), MID_LEG, ms).x - POS.x).toBeCloseTo(30);
            }
        }
    });

    it("keeps a gusting push within its swing above and below the strength", () => {
        const wind = ParticleModifierUtils.createWind({ directionDegrees: 0, strengthPixels: 30, gustRatio: 0.5 });

        for (const ms of TIMES_MS) {
            for (const id of IDS) {
                const push = wind(POS, toTravel({ id }), MID_LEG, ms).x - POS.x;

                expect(push).toBeGreaterThanOrEqual(15 - 1e-9);
                expect(push).toBeLessThanOrEqual(45 + 1e-9);
            }
        }
    });

    it("answers the same at the same moment, so a scrub draws the same picture", () => {
        const wind = ParticleModifierUtils.createWind();

        expect(wind(POS, toTravel({ id: 7 }), 0.3, 480)).toEqual(wind(POS, toTravel({ id: 7 }), 0.3, 480));
    });
});

describe("ParticleModifierUtils.createAttraction", () => {
    const CENTER = { x: 40, y: 20 };

    it("bends nothing beyond its reach", () => {
        const attraction = ParticleModifierUtils.createAttraction({ offset: CENTER, reachPixels: 10 });

        expect(attraction(POS, toTravel(), MID_LEG, 0)).toEqual(POS);
    });

    it("draws a particle within reach toward the point mid-leg, and never past it", () => {
        const attraction = ParticleModifierUtils.createAttraction({
            offset: CENTER,
            reachPixels: 100,
            strengthRatio: 1,
        });
        const moved = attraction(POS, toTravel(), MID_LEG, 0);

        expect(moved.x).toBeGreaterThan(POS.x);
        expect(moved.x).toBeLessThanOrEqual(CENTER.x);
        expect(moved.y).toBeCloseTo(POS.y);
    });

    it("leaves a particle on its stop at either end of a leg", () => {
        const attraction = ParticleModifierUtils.createAttraction({
            offset: CENTER,
            reachPixels: 100,
            strengthRatio: 1,
        });

        for (const t of LEG_ENDS) {
            const moved = attraction(POS, toTravel(), t, 0);

            expect(moved.x).toBeCloseTo(POS.x);
            expect(moved.y).toBeCloseTo(POS.y);
        }
    });

    it("moves nothing for a reader who asks for reduced motion", () => {
        const attraction = ParticleModifierUtils.createAttraction({ offset: CENTER, reachPixels: 100 });

        expect(attraction(POS, toTravel({ prefersReducedMotion: true }), MID_LEG, 0)).toEqual(POS);
    });

    it("measures its offset from the spawner's center", () => {
        const attraction = ParticleModifierUtils.createAttraction({ offset: { x: 30, y: 0 }, reachPixels: 100 });
        const moved = attraction(POS, toTravel({ origin: { x: 10, y: 20 } }), MID_LEG, 0);

        expect(moved.x).toBeGreaterThan(POS.x);
        expect(moved.y).toBeCloseTo(POS.y);
    });

    it("follows the marker it names, and pulls nothing while that marker is not on the page", () => {
        const attraction = ParticleModifierUtils.createAttraction({ modMarkerIndex: 1, reachPixels: 100 });

        expect(attraction(POS, toTravel({ modMarkers: [undefined, CENTER] }), MID_LEG, 0).x).toBeGreaterThan(POS.x);
        expect(attraction(POS, toTravel({ modMarkers: [CENTER, undefined] }), MID_LEG, 0)).toEqual(POS);
    });
});
