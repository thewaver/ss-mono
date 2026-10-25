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

describe("createOriginKeeper", () => {
    const createElement = (name: string) =>
        ({ name, isConnected: true }) as unknown as HTMLElement & { isConnected: boolean };

    const focus = (element: HTMLElement) => {
        vi.stubGlobal("document", { activeElement: element });
    };

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("answers what held focus the first time, however often focus moves before the layer shows again", () => {
        const opener = createElement("opener");
        const keeper = FocusManagerUtils.createOriginKeeper();

        focus(opener);
        expect(keeper.take()).toBe(opener);

        focus(createElement("the control a layer above left focus on"));
        expect(keeper.take(), "the layer came back from under another").toBe(opener);
    });

    it("starts again from wherever focus is once forgotten, as when the layer closed in between", () => {
        const keeper = FocusManagerUtils.createOriginKeeper();
        const secondOpener = createElement("second opener");

        focus(createElement("first opener"));
        keeper.take();
        keeper.forget();

        focus(secondOpener);
        expect(keeper.take()).toBe(secondOpener);
    });

    it("lets go of an origin that has left the document, since focus cannot go back to it", () => {
        const opener = createElement("opener");
        const keeper = FocusManagerUtils.createOriginKeeper();
        const stillThere = createElement("still there");

        focus(opener);
        keeper.take();
        opener.isConnected = false;

        focus(stillThere);
        expect(keeper.take()).toBe(stillThere);
    });
});
