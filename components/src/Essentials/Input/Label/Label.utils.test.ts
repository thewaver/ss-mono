import { afterEach, describe, expect, it, vi } from "vitest";

import { LabelUtils } from "./Label.utils";

describe("LabelUtils.warnIfShadowed", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("warns, naming the prop, when a control inside a Label is given its own aria-label", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        LabelUtils.warnIfShadowed(true, true, "ariaLabel");

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain("ariaLabel");
    });

    it("says nothing outside a Label, or with no aria-label of its own", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        LabelUtils.warnIfShadowed(false, true, "ariaLabel");
        LabelUtils.warnIfShadowed(true, false, "ariaLabel");

        expect(warn).not.toHaveBeenCalled();
    });
});
