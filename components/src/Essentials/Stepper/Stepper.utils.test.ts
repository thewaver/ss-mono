import { describe, expect, it, vi } from "vitest";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import { StepperUtils } from "./Stepper.utils";

const rect = (leftShare: number) => ({ leftShare, topShare: 0.5, widthShare: 0.2, heightShare: 0.2 });

const LAYOUT: PlacementLayout = {
    heightRatio: 1,
    placements: [rect(0.1), rect(0.5), rect(0.9)],
    origin: { x: 0.5, y: 1 },
    radii: { x: 0.4, y: 0.4 },
};

describe("computeConnectorDefs", () => {
    it("tells a straight run only where it is", () => {
        expect(StepperUtils.computeConnectorDefs(1, undefined)).toEqual({
            index: 1,
            from: undefined,
            to: undefined,
            origin: undefined,
            radii: undefined,
        });
    });

    it("hands a laid-out run the two placements it joins and the curve they sit on", () => {
        expect(StepperUtils.computeConnectorDefs(1, LAYOUT)).toEqual({
            index: 1,
            from: LAYOUT.placements[1],
            to: LAYOUT.placements[2],
            origin: LAYOUT.origin,
            radii: LAYOUT.radii,
        });
    });

    it("has nowhere to go from the last step", () => {
        expect(StepperUtils.computeConnectorDefs(2, LAYOUT).to).toBeUndefined();
    });
});

describe("warnIfBodyIgnored", () => {
    it("warns only when a body and a layout were both given", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        StepperUtils.warnIfBodyIgnored(true, false);
        StepperUtils.warnIfBodyIgnored(false, true);
        expect(warn).not.toHaveBeenCalled();

        StepperUtils.warnIfBodyIgnored(true, true);
        expect(warn).toHaveBeenCalledOnce();

        warn.mockRestore();
    });
});
