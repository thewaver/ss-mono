import { describe, expect, it } from "vitest";

import { SidebarUtils } from "./Sidebar.utils";

describe("computePhase", () => {
    it("names the transition while it runs", () => {
        expect(SidebarUtils.computePhase(true, false)).toBe("expanding");
        expect(SidebarUtils.computePhase(false, false)).toBe("collapsing");
    });

    it("names where it settled once it has finished", () => {
        expect(SidebarUtils.computePhase(true, true)).toBe("expanded");
        expect(SidebarUtils.computePhase(false, true)).toBe("collapsed");
    });
});
