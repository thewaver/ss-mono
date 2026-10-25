import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { DismisserLayerDefs, DismisserReason } from "./Dismisser.types";
import { DismisserUtils } from "./Dismisser.utils";

beforeAll(() => {
    vi.stubGlobal("document", new EventTarget());
});

afterAll(() => {
    vi.unstubAllGlobals();
});

const pressKey = (key: string, isAlreadyAnswered = false) => {
    const event = Object.assign(new Event("keydown", { cancelable: true }), { key });

    if (isAlreadyAnswered) event.preventDefault();

    document.dispatchEvent(event);

    return event;
};

const layer = (defs: Partial<DismisserLayerDefs> = {}) => {
    const reasons: DismisserReason[] = [];

    return {
        reasons,
        defs: { getRoots: () => [], onDismiss: (reason: DismisserReason) => reasons.push(reason), ...defs },
    };
};

describe("Escape", () => {
    it("reaches only the topmost layer", () => {
        const below = layer();
        const above = layer();

        const removeBelow = DismisserUtils.addLayer(below.defs);
        const removeAbove = DismisserUtils.addLayer(above.defs);

        pressKey("Escape");

        expect(above.reasons).toEqual(["escape"]);
        expect(below.reasons, "the layer beneath waits for its own Escape").toEqual([]);

        removeAbove();
        removeBelow();
    });

    it("is left alone once something has answered it, so a canceled drag does not also close the dialog", () => {
        const dialog = layer();

        const remove = DismisserUtils.addLayer(dialog.defs);

        pressKey("Escape", true);

        expect(dialog.reasons).toEqual([]);

        pressKey("Escape");

        expect(dialog.reasons, "the next, unanswered Escape still closes it").toEqual(["escape"]);

        remove();
    });

    it("marks the key it uses, and ignores every other key", () => {
        const dialog = layer();

        const remove = DismisserUtils.addLayer(dialog.defs);

        expect(pressKey("Escape").defaultPrevented).toBe(true);
        expect(pressKey("a").defaultPrevented).toBe(false);
        expect(dialog.reasons).toEqual(["escape"]);

        remove();
    });
});

describe("getTopLayerInGroup", () => {
    it("answers with the group's member opened last, whatever is open above or below it", () => {
        const first = layer({ group: "spotlight" });
        const dialog = layer();
        const second = layer({ group: "spotlight", isPassive: true });
        const menu = layer();

        const removers = [first, dialog, second, menu].map((entry) => DismisserUtils.addLayer(entry.defs));

        expect(DismisserUtils.getTopLayerInGroup("spotlight"), "a passive member counts").toBe(second.defs);

        removers[2]();

        expect(DismisserUtils.getTopLayerInGroup("spotlight"), "and the one beneath takes over").toBe(first.defs);

        removers[0]();

        expect(DismisserUtils.getTopLayerInGroup("spotlight")).toBeUndefined();

        removers.forEach((remove) => remove());
    });
});

describe("getIsTopForInput", () => {
    it("is the top layer taking input, for a layer that takes input", () => {
        const below = layer();
        const above = layer();

        const removeBelow = DismisserUtils.addLayer(below.defs);
        const removeAbove = DismisserUtils.addLayer(above.defs);

        expect(DismisserUtils.getIsTopForInput(above.defs)).toBe(true);
        expect(DismisserUtils.getIsTopForInput(below.defs)).toBe(false);

        removeAbove();
        removeBelow();
    });

    it("lets a passive layer answer keys only while nothing above it takes input", () => {
        const hint = layer({ isPassive: true });
        const tooltip = layer({ isPassive: true });
        const dialog = layer();

        const removeHint = DismisserUtils.addLayer(hint.defs);
        const removeTooltip = DismisserUtils.addLayer(tooltip.defs);

        expect(DismisserUtils.getIsTopForInput(hint.defs), "a passive layer above takes nothing").toBe(true);

        const removeDialog = DismisserUtils.addLayer(dialog.defs);

        expect(DismisserUtils.getIsTopForInput(hint.defs), "a dialog above takes the keys").toBe(false);

        removeDialog();
        removeTooltip();
        removeHint();

        expect(DismisserUtils.getIsTopForInput(hint.defs), "a closed layer answers nothing").toBe(false);
    });
});

describe("openLayers", () => {
    it("tells a reader about every layer added or removed", () => {
        const listener = vi.fn();
        const stop = DismisserUtils.openLayers.subscribe(listener);
        const entry = layer();

        const remove = DismisserUtils.addLayer(entry.defs);

        expect(DismisserUtils.openLayers.get()).toEqual([entry.defs]);

        remove();
        remove();

        expect(listener, "removing twice tells nobody twice").toHaveBeenCalledTimes(2);
        expect(DismisserUtils.openLayers.get()).toEqual([]);

        stop();
    });
});
