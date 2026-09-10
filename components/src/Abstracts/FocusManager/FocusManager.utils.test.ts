import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FocusManagerUtils } from "./FocusManager.utils";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
});

describe("runFocusRestore", () => {
    it("reports nothing in progress when nobody is restoring focus", () => {
        expect(FocusManagerUtils.getIsRestoringFocus()).toBe(false);
    });

    it("is raised for the duration of the restore itself", () => {
        let seenInside = false;

        FocusManagerUtils.runFocusRestore(() => {
            seenInside = FocusManagerUtils.getIsRestoringFocus();
        });

        expect(seenInside).toBe(true);
    });

    it("stays raised past the end of the restore, so the focus event it causes still finds it raised", () => {
        FocusManagerUtils.runFocusRestore(() => {});

        expect(FocusManagerUtils.getIsRestoringFocus(), "the browser has not delivered the focus event yet").toBe(true);

        vi.runAllTimers();

        expect(FocusManagerUtils.getIsRestoringFocus()).toBe(false);
    });

    it("stays raised until the last of several restores has been delivered", () => {
        FocusManagerUtils.runFocusRestore(() => {
            FocusManagerUtils.runFocusRestore(() => {});
        });

        expect(FocusManagerUtils.getIsRestoringFocus()).toBe(true);

        vi.runAllTimers();

        expect(FocusManagerUtils.getIsRestoringFocus(), "both have been accounted for").toBe(false);
    });

    it("lets go even when the restore throws, rather than leaving every later focus ignored", () => {
        expect(() =>
            FocusManagerUtils.runFocusRestore(() => {
                throw new Error("the element went away");
            }),
        ).toThrow("the element went away");

        vi.runAllTimers();

        expect(FocusManagerUtils.getIsRestoringFocus()).toBe(false);
    });
});
