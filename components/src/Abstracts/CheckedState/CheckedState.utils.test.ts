import { describe, expect, it } from "vitest";

import { CheckedStateUtils } from "./CheckedState.utils";

describe("fromMembers", () => {
    it("reports true only when every member is checked", () => {
        expect(CheckedStateUtils.fromMembers([true, true, true])).toBe(true);
        expect(CheckedStateUtils.fromMembers([true])).toBe(true);
    });

    it("reports false only when no member is checked", () => {
        expect(CheckedStateUtils.fromMembers([false, false])).toBe(false);
        expect(CheckedStateUtils.fromMembers([false])).toBe(false);
    });

    it("reports mixed as soon as the members disagree", () => {
        expect(CheckedStateUtils.fromMembers([true, false])).toBe("mixed");
        expect(CheckedStateUtils.fromMembers([false, true, false])).toBe("mixed");
    });

    it("treats an empty set as unchecked rather than mixed", () => {
        expect(CheckedStateUtils.fromMembers([])).toBe(false);
    });
});
