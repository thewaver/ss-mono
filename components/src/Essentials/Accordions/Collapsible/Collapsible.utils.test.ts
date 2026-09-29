import { describe, expect, it } from "vitest";

import { CollapsibleUtils } from "./Collapsible.utils";

const CONTENT_SIZE = { width: 200, height: 80 };

describe("getHeadingTag", () => {
    it("has no heading without a level", () => {
        expect(CollapsibleUtils.getHeadingTag(undefined)).toBeUndefined();
    });

    it("names the heading for a level", () => {
        expect(CollapsibleUtils.getHeadingTag(3)).toBe("h3");
    });

    it("holds a level outside one to six to the nearest end", () => {
        expect(CollapsibleUtils.getHeadingTag(0)).toBe("h1");
        expect(CollapsibleUtils.getHeadingTag(9)).toBe("h6");
    });
});

describe("getPanelAxis", () => {
    it("grows a panel beside the trigger across, and one above or below it down", () => {
        expect(CollapsibleUtils.getPanelAxis("left")).toBe("width");
        expect(CollapsibleUtils.getPanelAxis("right")).toBe("width");
        expect(CollapsibleUtils.getPanelAxis("top")).toBe("height");
        expect(CollapsibleUtils.getPanelAxis("bottom")).toBe("height");
    });
});

describe("computeHasPanelContent", () => {
    it("builds up front unless asked to wait", () => {
        expect(CollapsibleUtils.computeHasPanelContent(false, undefined, false)).toBe(true);
        expect(CollapsibleUtils.computeHasPanelContent(false, true, false)).toBe(false);
    });

    it("builds a lazy panel on its first open, and keeps it once built", () => {
        expect(CollapsibleUtils.computeHasPanelContent(false, true, true)).toBe(true);
        expect(CollapsibleUtils.computeHasPanelContent(true, true, false)).toBe(true);
    });
});

describe("computePanelExtent", () => {
    it("opens to the contents' own extent along the panel's axis", () => {
        expect(CollapsibleUtils.computePanelExtent(1, CONTENT_SIZE, "bottom")).toBe(80);
        expect(CollapsibleUtils.computePanelExtent(1, CONTENT_SIZE, "right")).toBe(200);
    });

    it("is shut while the fade heads out", () => {
        expect(CollapsibleUtils.computePanelExtent(0, CONTENT_SIZE, "bottom")).toBe(0);
    });
});
