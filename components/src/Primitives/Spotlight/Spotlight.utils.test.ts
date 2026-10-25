import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { Rect } from "@thewaver/ss-utils";

import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import type { SpotlightMode } from "./Spotlight.types";
import { SpotlightUtils } from "./Spotlight.utils";

const RECT: Rect = { x: 100, y: 50, width: 200, height: 80 };

describe("getHoleClipPath", () => {
    it("traces the whole layer and then the hole, so the hole is what is cut away", () => {
        expect(SpotlightUtils.getHoleClipPath(RECT)).toBe(
            "polygon(evenodd, 0 0, 0 100%, 100% 100%, 100% 0, 0 0, " +
                "100px 50px, 300px 50px, 300px 130px, 100px 130px, 100px 50px, 0 0)",
        );
    });

    it("measures the outer ring against the layer rather than a known size", () => {
        expect(SpotlightUtils.getHoleClipPath(RECT), "so it fills whatever the viewport is").toContain(
            "0 0, 0 100%, 100% 100%, 100% 0",
        );
    });

    it("collapses to a hole of nothing for a rect with no size", () => {
        const path = SpotlightUtils.getHoleClipPath({ x: 0, y: 0, width: 0, height: 0 });

        expect(path, "every hole corner lands on the same point, so nothing is cut").toBe(
            "polygon(evenodd, 0 0, 0 100%, 100% 100%, 100% 0, 0 0, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0 0)",
        );
    });
});

describe("getIsDismissedByKey", () => {
    it("dismisses every mode on Escape", () => {
        expect(SpotlightUtils.getIsDismissedByKey("Escape", "hint")).toBe(true);
        expect(SpotlightUtils.getIsDismissedByKey("Escape", "prompt")).toBe(true);
        expect(SpotlightUtils.getIsDismissedByKey("Escape", "guide")).toBe(true);
    });

    it("dismisses a hint on any real key, but not on a bare modifier", () => {
        expect(SpotlightUtils.getIsDismissedByKey("a", "hint")).toBe(true);
        expect(SpotlightUtils.getIsDismissedByKey("Shift", "hint")).toBe(false);
    });

    it("leaves the insistent modes alone on any other key", () => {
        expect(SpotlightUtils.getIsDismissedByKey("a", "prompt")).toBe(false);
        expect(SpotlightUtils.getIsDismissedByKey("a", "guide")).toBe(false);
    });
});

describe("getIsAnnouncementDue", () => {
    it("speaks a change, and not the first announcement or a repeat", () => {
        expect(SpotlightUtils.getIsAnnouncementDue(undefined, "Step 1")).toBe(false);
        expect(SpotlightUtils.getIsAnnouncementDue("Step 1", "Step 1")).toBe(false);
        expect(SpotlightUtils.getIsAnnouncementDue("Step 1", "Step 2")).toBe(true);
        expect(SpotlightUtils.getIsAnnouncementDue("Step 1", undefined)).toBe(false);
    });
});

describe("warnIfUnannounced", () => {
    const warnCount = (announcement: string | undefined) => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        const hasWarned = SpotlightUtils.warnIfUnannounced(announcement, "announcement");

        const calls = warn.mock.calls.length;

        warn.mockRestore();

        expect(hasWarned).toBe(calls > 0);

        return calls;
    };

    it("warns once, and says so, when a step has no announcement or an empty one", () => {
        expect(warnCount(undefined)).toBe(1);
        expect(warnCount("")).toBe(1);
    });

    it("says nothing when the step has one", () => {
        expect(warnCount("Step 2 of 4. The basket.")).toBe(0);
    });
});

describe("the spotlight's place in the dismissal stack", () => {
    beforeAll(() => {
        vi.stubGlobal("document", new EventTarget());
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    const spotlight = (mode: SpotlightMode) => {
        const dismiss = vi.fn();

        return { dismiss, layer: SpotlightUtils.createLayer(() => mode, dismiss) };
    };

    const pressKey = (key: string) => document.dispatchEvent(Object.assign(new Event("keydown"), { key }));

    it("closes on Escape only, since a press or a focus move reaches it through its own overlay", () => {
        const prompt = spotlight("prompt");

        prompt.layer.onDismiss("press");
        prompt.layer.onDismiss("focus");

        expect(prompt.dismiss).not.toHaveBeenCalled();

        prompt.layer.onDismiss("escape");

        expect(prompt.dismiss).toHaveBeenCalledOnce();
    });

    it("lets a hint leave a page's shortcuts alone, and has the other modes take the keyboard", () => {
        expect(spotlight("hint").layer.isPassive).toBe(true);
        expect(spotlight("prompt").layer.isPassive).toBe(false);
        expect(spotlight("guide").layer.isPassive).toBe(false);
    });

    it("puts the spotlight opened last on top, and hands back to the one beneath when it closes", () => {
        const guide = spotlight("guide");
        const prompt = spotlight("prompt");
        const dialog = { getRoots: () => [], onDismiss: () => {} };

        const removeGuide = DismisserUtils.addLayer(guide.layer);
        const removeDialog = DismisserUtils.addLayer(dialog);
        const removePrompt = DismisserUtils.addLayer(prompt.layer);

        expect(SpotlightUtils.getIsOnTop(prompt.layer)).toBe(true);
        expect(SpotlightUtils.getIsOnTop(guide.layer)).toBe(false);

        removePrompt();

        expect(SpotlightUtils.getIsOnTop(guide.layer), "a dialog above makes no difference").toBe(true);

        removeDialog();
        removeGuide();

        expect(SpotlightUtils.getIsOnTop(guide.layer)).toBe(false);
    });

    it("hears a hint's other keys only while no layer taking input sits above it", () => {
        const hint = spotlight("hint");
        const dialog = { getRoots: () => [], onDismiss: () => {} };

        const removeHint = DismisserUtils.addLayer(hint.layer);
        const stop = SpotlightUtils.observeDismissKeys(hint.layer, () => "hint", hint.dismiss);

        const removeDialog = DismisserUtils.addLayer(dialog);

        pressKey("a");

        expect(hint.dismiss, "typing into a dialog over the hint").not.toHaveBeenCalled();

        removeDialog();
        pressKey("a");

        expect(hint.dismiss).toHaveBeenCalledOnce();

        pressKey("Escape");

        expect(
            hint.dismiss,
            "Escape arrives once, through the stack, and not again through the listener",
        ).toHaveBeenCalledTimes(2);

        stop();
        removeHint();
    });
});
