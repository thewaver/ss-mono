import { afterEach, describe, expect, it, vi } from "vitest";

import { SafeHrefUtils } from "./SafeHref.utils";

describe("SafeHrefUtils.resolve", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("passes an ordinary address unchanged and says nothing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        expect(SafeHrefUtils.resolve("/about", "Breadcrumbs")).toBe("/about");
        expect(warn).not.toHaveBeenCalled();
    });

    it("refuses an address that would run script, and warns once naming the component", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        expect(SafeHrefUtils.resolve("javascript:alert(1)", "Breadcrumbs")).toBeUndefined();
        expect(SafeHrefUtils.resolve("javascript:alert(1)", "Breadcrumbs")).toBeUndefined();
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain("Breadcrumbs");
    });

    it("answers nothing for nothing, without a warning", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        expect(SafeHrefUtils.resolve(undefined, "Tabs")).toBeUndefined();
        expect(warn).not.toHaveBeenCalled();
    });
});
