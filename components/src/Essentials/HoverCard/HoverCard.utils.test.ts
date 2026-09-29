import { describe, expect, it } from "vitest";

import { HoverCardUtils } from "./HoverCard.utils";

describe("resolveDismissal", () => {
    it("closes on Escape and puts focus back, wherever the pointer is", () => {
        expect(HoverCardUtils.resolveDismissal("escape", true)).toBe("restore");
        expect(HoverCardUtils.resolveDismissal("escape", false)).toBe("restore");
    });

    it("ignores focus leaving while the pointer still holds the card", () => {
        expect(HoverCardUtils.resolveDismissal("focus", true)).toBe("ignore");
        expect(HoverCardUtils.resolveDismissal("focus", false)).toBe("close");
    });

    it("closes on a press outside", () => {
        expect(HoverCardUtils.resolveDismissal("press", true)).toBe("close");
    });
});
