import { describe, expect, it } from "vitest";

import { ScrollerUtils } from "./Scroller.utils";

describe("ScrollerUtils.getSteps", () => {
    it("splits the buttons, or puts both on one side", () => {
        expect(ScrollerUtils.getSteps("split", true)).toEqual({ leading: ["previous"], trailing: ["next"] });
        expect(ScrollerUtils.getSteps("start", true)).toEqual({ leading: ["previous", "next"], trailing: [] });
        expect(ScrollerUtils.getSteps("end", true)).toEqual({ leading: [], trailing: ["previous", "next"] });
    });

    it("renders none when there is nothing to scroll", () => {
        expect(ScrollerUtils.getSteps("split", false)).toEqual({ leading: [], trailing: [] });
    });
});

describe("ScrollerUtils reading the ends", () => {
    it("counts a pixel from either end as arrived", () => {
        expect(ScrollerUtils.getIsAtStart({ start: 1, visible: 100, total: 300 })).toBe(true);
        expect(ScrollerUtils.getIsAtStart({ start: 2, visible: 100, total: 300 })).toBe(false);
        expect(ScrollerUtils.getIsAtEnd({ start: 199, visible: 100, total: 300 })).toBe(true);
        expect(ScrollerUtils.getIsAtEnd({ start: 150, visible: 100, total: 300 })).toBe(false);
    });

    it("is scrollable only when the content overruns by more than a pixel", () => {
        expect(ScrollerUtils.getIsScrollable({ start: 0, visible: 100, total: 101 })).toBe(false);
        expect(ScrollerUtils.getIsScrollable({ start: 0, visible: 100, total: 102 })).toBe(true);
    });
});

describe("ScrollerUtils.computeProgressRatio", () => {
    it("is the position over the distance there is to travel", () => {
        expect(ScrollerUtils.computeProgressRatio({ start: 50, visible: 100, total: 300 })).toBe(0.25);
    });

    it("is zero when nothing overflows", () => {
        expect(ScrollerUtils.computeProgressRatio({ start: 0, visible: 100, total: 80 })).toBe(0);
    });
});

describe("ScrollerUtils.computeStepLanding", () => {
    const ITEMS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const VISIBLE = 350;

    it("lands on the furthest item start within the next view, and the nearest within the previous", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0)).toBe(300);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700)).toBe(400);
    });

    it("goes a full view from a box holding one item that leading padding sets a little way in", () => {
        expect(ScrollerUtils.computeStepLanding([2], VISIBLE, "next", 0)).toBe(VISIBLE);
    });

    it("never lands on the first item while the box has not scrolled past its start", () => {
        const padded = ITEMS.map((offset) => offset + 2);

        expect(ScrollerUtils.computeStepLanding(padded, VISIBLE, "next", 0, ITEMS.length)).toBe(padded[1]);
    });

    it("keeps one more item of the view just left for each of overlap, going forward", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 1)).toBe(200);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 2)).toBe(100);
    });

    it("keeps one more item of the view just left for each of overlap, going back", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 1)).toBe(500);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 2)).toBe(600);
    });

    it("still moves by one item however much overlap is asked for", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 50)).toBe(100);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 50)).toBe(600);
    });

    it("treats a negative, fractional or unreadable overlap as a whole number from zero", () => {
        const plain = ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0);

        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, -3)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 0.9)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, Number.NaN)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 1.9)).toBe(200);
    });

    it("goes a full view where there is no item start inside it, whatever the overlap", () => {
        expect(ScrollerUtils.computeStepLanding([0], VISIBLE, "next", 0, 2)).toBe(VISIBLE);
        expect(ScrollerUtils.computeStepLanding([0], VISIBLE, "previous", 500, 2)).toBe(150);
    });
});

describe("ScrollerUtils.computeProgress", () => {
    it("reads each axis on its own", () => {
        expect(
            ScrollerUtils.computeProgress({
                x: { start: 50, visible: 100, total: 300 },
                y: { start: 0, visible: 100, total: 80 },
            }),
        ).toEqual({ x: 0.25, y: 0 });
    });
});

describe("ScrollerUtils.getRunAxis", () => {
    it("stacks children in a column only for a box scrolling down and not across", () => {
        expect(ScrollerUtils.getRunAxis("hidden", "auto")).toBe("y");
        expect(ScrollerUtils.getRunAxis("hidden", "scroll")).toBe("y");
    });

    it("keeps a row for a box scrolling across, both ways, or neither", () => {
        expect(ScrollerUtils.getRunAxis("auto", "hidden")).toBe("x");
        expect(ScrollerUtils.getRunAxis("auto", "auto")).toBe("x");
        expect(ScrollerUtils.getRunAxis("hidden", "hidden")).toBe("x");
    });
});

describe("ScrollerUtils.getHasBar", () => {
    const OVERFLOWING = { start: 0, visible: 100, total: 300 };
    const FITTING = { start: 0, visible: 100, total: 100 };

    it("shows the bar under auto only while the content overflows", () => {
        expect(ScrollerUtils.getHasBar("auto", OVERFLOWING)).toBe(true);
        expect(ScrollerUtils.getHasBar("auto", FITTING)).toBe(false);
    });

    it("always shows it under scroll, and never under hidden", () => {
        expect(ScrollerUtils.getHasBar("scroll", FITTING)).toBe(true);
        expect(ScrollerUtils.getHasBar("hidden", OVERFLOWING)).toBe(false);
    });
});

describe("ScrollerUtils.getBoxSteps", () => {
    const OVERFLOWING = { start: 0, visible: 100, total: 300 };

    it("gives each scrolling axis its own pair, placed alike", () => {
        const steps = ScrollerUtils.getBoxSteps("split", { x: "auto", y: "auto" }, { x: OVERFLOWING, y: OVERFLOWING });

        expect(steps.x).toEqual(ScrollerUtils.getSteps("split", true));
        expect(steps.y).toEqual(steps.x);
    });

    it("gives a hidden axis none, however far its content overruns", () => {
        const steps = ScrollerUtils.getBoxSteps(
            "split",
            { x: "auto", y: "hidden" },
            { x: OVERFLOWING, y: OVERFLOWING },
        );

        expect(steps.y).toEqual(ScrollerUtils.getSteps("split", false));
    });
});

describe("ScrollerUtils.computeGridTemplate", () => {
    const NONE = ScrollerUtils.getSteps("split", false);
    const SPLIT = ScrollerUtils.getSteps("split", true);
    const AT_END = ScrollerUtils.getSteps("end", true);
    const { area, xLeading, xTrailing, yLeading, yTrailing } = ScrollerUtils.AREAS;

    it("is the box's cell alone when there are no buttons, so no gap is left around an empty track", () => {
        expect(ScrollerUtils.computeGridTemplate({ x: NONE, y: NONE })).toEqual({
            areas: `"${area}"`,
            columns: "minmax(0, 1fr)",
            rows: "minmax(0, 1fr)",
        });
    });

    it("writes a column only on the side that holds buttons", () => {
        const template = ScrollerUtils.computeGridTemplate({ x: AT_END, y: NONE });

        expect(template.areas).toBe(`"${area} ${xTrailing}"`);
        expect(template.columns).toBe(`${ScrollerUtils.computeGridTemplate({ x: NONE, y: NONE }).columns} auto`);
    });

    it("puts the buttons stepping down above and below the box, in its column", () => {
        const template = ScrollerUtils.computeGridTemplate({ x: SPLIT, y: SPLIT });

        expect(template.areas).toBe(
            [`". ${yLeading} ."`, `"${xLeading} ${area} ${xTrailing}"`, `". ${yTrailing} ."`].join(" "),
        );
    });
});

describe("ScrollerUtils.computeThumbLength", () => {
    it("is the share of the content in view, applied to the track", () => {
        expect(ScrollerUtils.computeThumbLength({ start: 0, visible: 100, total: 400 }, 200)).toBe(50);
    });

    it("never falls below the 24-pixel target size, nor runs past the track", () => {
        expect(ScrollerUtils.computeThumbLength({ start: 0, visible: 10, total: 10_000 }, 200)).toBe(24);
        expect(ScrollerUtils.computeThumbLength({ start: 0, visible: 100, total: 80 }, 200)).toBe(200);
    });

    it("fills a track shorter than the target size, and is nothing on a track with no length", () => {
        expect(ScrollerUtils.computeThumbLength({ start: 0, visible: 10, total: 10_000 }, 16)).toBe(16);
        expect(ScrollerUtils.computeThumbLength({ start: 0, visible: 100, total: 400 }, 0)).toBe(0);
    });
});

describe("ScrollerUtils.computeThumbOffset", () => {
    it("travels the track less the thumb, so the thumb meets the far end at the end of the run", () => {
        expect(ScrollerUtils.computeThumbOffset(0, 200, 50)).toBe(0);
        expect(ScrollerUtils.computeThumbOffset(1, 200, 50) + 50).toBe(200);
    });

    it("holds a ratio outside the run at its ends", () => {
        expect(ScrollerUtils.computeThumbOffset(2, 200, 50)).toBe(ScrollerUtils.computeThumbOffset(1, 200, 50));
        expect(ScrollerUtils.computeThumbOffset(-1, 200, 50)).toBe(0);
    });
});

describe("ScrollerUtils.computeRatioAtPosition", () => {
    it("is the progress that puts the thumb's middle under the point", () => {
        const ratio = ScrollerUtils.computeRatioAtPosition(100, 200, 50);

        expect(ScrollerUtils.computeThumbOffset(ratio, 200, 50) + 25).toBe(100);
    });

    it("reads a point nearer an end than half the thumb as that end", () => {
        expect(ScrollerUtils.computeRatioAtPosition(10, 200, 50)).toBe(0);
        expect(ScrollerUtils.computeRatioAtPosition(190, 200, 50)).toBe(1);
    });

    it("is the start on a track no longer than its thumb", () => {
        expect(ScrollerUtils.computeRatioAtPosition(100, 50, 50)).toBe(0);
    });
});

describe("ScrollerUtils.computeTrackPressStep", () => {
    const TRACK = 200;
    const THUMB = 50;
    const reach = ScrollerUtils.computeThumbReach(TRACK, THUMB);
    const at = (position: number) => ScrollerUtils.computeRatioAtPosition(position, TRACK, THUMB);

    it("pages towards a press beyond either end of the thumb", () => {
        expect(ScrollerUtils.computeTrackPressStep(at(180), at(25), reach)).toBe("next");
        expect(ScrollerUtils.computeTrackPressStep(at(20), at(150), reach)).toBe("previous");
    });

    it("stops once the thumb covers the press", () => {
        expect(ScrollerUtils.computeTrackPressStep(at(110), at(100), reach)).toBeUndefined();
        expect(ScrollerUtils.computeTrackPressStep(at(124), at(100), reach)).toBeUndefined();
    });

    it("never pages on a thumb that cannot travel", () => {
        expect(
            ScrollerUtils.computeTrackPressStep(1, 0, ScrollerUtils.computeThumbReach(THUMB, THUMB)),
        ).toBeUndefined();
    });
});
