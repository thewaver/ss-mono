import { createRoot } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LABEL_CONTEXT, LabelContextProvider } from "./Label.context";
import { LabelUtils } from "./Label.utils";

const resolveOutsideLabel = (getAriaLabel?: () => string) => {
    let resolved!: () => string | undefined;

    const dispose = createRoot((disposeRoot) => {
        resolved = LabelUtils.resolveAriaLabel(getAriaLabel);

        return disposeRoot;
    });

    const value = resolved();

    dispose();

    return value;
};

const resolveInsideLabel = (getAriaLabel?: () => string) => {
    let resolved!: () => string | undefined;

    const dispose = createRoot((disposeRoot) => {
        LabelContextProvider({
            value: LABEL_CONTEXT,
            get children() {
                resolved = LabelUtils.resolveAriaLabel(getAriaLabel);

                return null;
            },
        });

        return disposeRoot;
    });

    const value = resolved();

    dispose();

    return value;
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("resolveAriaLabel", () => {
    it("passes the caller's label through when the control stands on its own", () => {
        expect(resolveOutsideLabel(() => "Amount")).toBe("Amount");
    });

    it("has nothing to offer when the caller gave no label and there is no caption either", () => {
        expect(resolveOutsideLabel()).toBeUndefined();
    });

    it("drops the caller's label inside a Label, leaving the visible caption to name the control", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        expect(resolveInsideLabel(() => "Amount")).toBeUndefined();
        expect(warn).toHaveBeenCalledOnce();
    });

    it("says so out loud when it drops one, because the two names would otherwise disagree in silence", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        resolveInsideLabel(() => "Amount");

        expect(warn.mock.calls[0][0]).toContain("aria-label");
    });

    it("stays quiet inside a Label when the caller gave no label, which is the ordinary case", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        expect(resolveInsideLabel()).toBeUndefined();
        expect(warn).not.toHaveBeenCalled();
    });
});
