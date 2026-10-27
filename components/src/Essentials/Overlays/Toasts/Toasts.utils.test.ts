import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BaseToast } from "./Toasts.types";
import { ToastUtils } from "./Toasts.utils";

const toast = (id: string): BaseToast<string> => ({ id, value: id, announcement: id });

const FIVE = ["a", "b", "c", "d", "e"].map(toast);

describe("computeStackAlignment", () => {
    it("maps a corner onto both flex axes for a plain column", () => {
        expect(ToastUtils.computeStackAlignment("bottom_right", "column")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("keeps the same corner when the column is reversed, by flipping the main axis alone", () => {
        expect(ToastUtils.computeStackAlignment("bottom_right", "column-reverse")).toEqual({
            justifyContent: "flex-start",
            alignItems: "flex-end",
        });
    });

    it("swaps which axis each half of the alignment drives for a row", () => {
        expect(ToastUtils.computeStackAlignment("top_center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("leaves a centered main axis alone when reversed, since center has no opposite", () => {
        expect(ToastUtils.computeStackAlignment("top_center", "row-reverse")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("flips the horizontal half for a reversed row", () => {
        expect(ToastUtils.computeStackAlignment("bottom_left", "row-reverse")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("reads middle and center as the same edge on whichever axis they land", () => {
        expect(ToastUtils.computeStackAlignment("middle_left", "column")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
        expect(ToastUtils.computeStackAlignment("middle_center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "center",
        });
    });
});

describe("computeSwipeDirection", () => {
    it("sends a toast off the side it sits against, corners included", () => {
        expect(ToastUtils.computeSwipeDirection("bottom_right")).toBe("right");
        expect(ToastUtils.computeSwipeDirection("top_left")).toBe("left");
        expect(ToastUtils.computeSwipeDirection("middle_right")).toBe("right");
    });

    it("sends a toast centered along the top or bottom off that edge", () => {
        expect(ToastUtils.computeSwipeDirection("top_center")).toBe("up");
        expect(ToastUtils.computeSwipeDirection("bottom_center")).toBe("down");
    });

    it("has no way off for a stack in the middle of the screen", () => {
        expect(ToastUtils.computeSwipeDirection("middle_center")).toBeUndefined();
    });
});

describe("computeSwipeAxis", () => {
    it("follows the swipe's direction, and falls back to across when there is none", () => {
        expect(ToastUtils.computeSwipeAxis("down")).toBe("vertical");
        expect(ToastUtils.computeSwipeAxis("right")).toBe("horizontal");
        expect(ToastUtils.computeSwipeAxis(undefined)).toBe("horizontal");
    });
});

describe("computeAdmitted", () => {
    it("admits everything without a limit, or within it", () => {
        expect(ToastUtils.computeAdmitted(FIVE, undefined, "dismiss_oldest")).toBe(FIVE);
        expect(ToastUtils.computeAdmitted(FIVE, 5, "dismiss_oldest")).toBe(FIVE);
    });

    it("admits the newest when the oldest are to be dismissed, and the oldest when the newest wait", () => {
        expect(ToastUtils.computeAdmitted(FIVE, 3, "dismiss_oldest").map((entry) => entry.id)).toEqual(["c", "d", "e"]);
        expect(ToastUtils.computeAdmitted(FIVE, 3, "hold_newest").map((entry) => entry.id)).toEqual(["a", "b", "c"]);
    });
});

describe("computeOverflowTrim", () => {
    it("writes the oldest out past the limit", () => {
        expect(ToastUtils.computeOverflowTrim(FIVE, 3, "dismiss_oldest")?.map((entry) => entry.id)).toEqual([
            "c",
            "d",
            "e",
        ]);
    });

    it("trims nothing within the limit, without one, or when the newest wait", () => {
        expect(ToastUtils.computeOverflowTrim(FIVE, 5, "dismiss_oldest")).toBeUndefined();
        expect(ToastUtils.computeOverflowTrim(FIVE, undefined, "dismiss_oldest")).toBeUndefined();
        expect(ToastUtils.computeOverflowTrim(FIVE, 3, "hold_newest")).toBeUndefined();
    });
});

describe("withToast", () => {
    it("adds a toast at the end of the queue", () => {
        expect(ToastUtils.withToast(FIVE.slice(0, 2), toast("z")).map((entry) => entry.id)).toEqual(["a", "b", "z"]);
    });

    it("answers the same queue for a toast already in it, so raising one twice writes nothing", () => {
        expect(ToastUtils.withToast(FIVE, toast("c"))).toBe(FIVE);
    });
});

describe("withoutToast", () => {
    it("takes one toast out", () => {
        expect(ToastUtils.withoutToast(FIVE, "b").map((entry) => entry.id)).toEqual(["a", "c", "d", "e"]);
    });

    it("answers the same list for a toast that is not there, so a second dismissal writes nothing", () => {
        expect(ToastUtils.withoutToast(FIVE, "z")).toBe(FIVE);
    });
});

describe("computeEntryIds", () => {
    it("appends new arrivals and keeps a leaving toast in its place", () => {
        expect(ToastUtils.computeEntryIds(["x", "a"], FIVE.slice(0, 2))).toEqual(["x", "a", "b"]);
    });

    it("answers the same list when nothing arrived", () => {
        const entryIds = ["a", "b"];

        expect(ToastUtils.computeEntryIds(entryIds, FIVE.slice(0, 2))).toBe(entryIds);
    });
});

describe("createCountdown", () => {
    const DURATION_MS = 4_000;

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("elapses after the duration", () => {
        const onElapse = vi.fn();

        ToastUtils.createCountdown().run(DURATION_MS, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS - 1);
        expect(onElapse).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(onElapse).toHaveBeenCalledTimes(1);
    });

    it("runs no clock while held", () => {
        const onElapse = vi.fn();

        expect(ToastUtils.createCountdown().run(DURATION_MS, true, onElapse)).toBeUndefined();

        vi.advanceTimersByTime(DURATION_MS * 2);
        expect(onElapse).not.toHaveBeenCalled();
    });

    it("gives a toast held half way through its remaining half, not a fresh duration", () => {
        const countdown = ToastUtils.createCountdown();
        const onElapse = vi.fn();

        const stop = countdown.run(DURATION_MS, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS * 0.5);
        stop?.();

        countdown.run(DURATION_MS, true, onElapse);
        vi.advanceTimersByTime(DURATION_MS * 2);

        countdown.run(DURATION_MS, false, onElapse);
        vi.advanceTimersByTime(DURATION_MS * 0.5);

        expect(onElapse).toHaveBeenCalledTimes(1);
    });

    it("starts again from a changed duration", () => {
        const countdown = ToastUtils.createCountdown();
        const onElapse = vi.fn();

        countdown.run(DURATION_MS, false, onElapse)?.();
        countdown.run(DURATION_MS * 2, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS * 2 - 1);
        expect(onElapse).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(onElapse).toHaveBeenCalledTimes(1);
    });
});

describe("withRequestedToast", () => {
    it("keeps the id a toast was raised with", () => {
        const result = ToastUtils.withRequestedToast(FIVE.slice(0, 2), { value: "z", announcement: "z", id: "z" });

        expect(result.id).toBe("z");
        expect(result.toasts.map((entry) => entry.id)).toEqual(["a", "b", "z"]);
    });

    it("makes up an id no queued toast has for a toast raised without one", () => {
        const first = ToastUtils.withRequestedToast<BaseToast<string>>([], { value: "x", announcement: "x" });
        const second = ToastUtils.withRequestedToast(first.toasts, { value: "y", announcement: "y" });

        expect(first.id).toBeDefined();
        expect(second.id).toBeDefined();
        expect(second.id).not.toBe(first.id);
        expect(second.toasts.map((entry) => entry.id)).toEqual([first.id, second.id]);
    });

    it("refuses a toast whose id is already queued, answering no id and the same queue", () => {
        const result = ToastUtils.withRequestedToast(FIVE, { value: "c", announcement: "c", id: "c" });

        expect(result.id).toBeUndefined();
        expect(result.toasts).toBe(FIVE);
    });
});

describe("UNPROVIDED_CONTEXT", () => {
    it("reports that neither raising nor dismissing acted", () => {
        expect(ToastUtils.UNPROVIDED_CONTEXT.show(toast("a"))).toBeUndefined();
        expect(ToastUtils.UNPROVIDED_CONTEXT.dismiss("a")).toBe(false);
    });
});

describe("computeCycleTarget", () => {
    it("goes from outside to the first stack holding toasts going forward, and the last going back", () => {
        expect(ToastUtils.computeCycleTarget([false, true, true, false], -1, 1)).toBe(1);
        expect(ToastUtils.computeCycleTarget([false, true, true, false], -1, -1)).toBe(2);
    });

    it("passes over empty stacks and wraps round the ends", () => {
        expect(ToastUtils.computeCycleTarget([true, false, true], 0, 1)).toBe(2);
        expect(ToastUtils.computeCycleTarget([true, false, true], 2, 1)).toBe(0);
        expect(ToastUtils.computeCycleTarget([true, false, true], 0, -1)).toBe(2);
    });

    it("has nowhere to go when no other stack holds toasts, or none does", () => {
        expect(ToastUtils.computeCycleTarget([false, true, false], 1, 1)).toBeUndefined();
        expect(ToastUtils.computeCycleTarget([false, false], -1, 1)).toBeUndefined();
        expect(ToastUtils.computeCycleTarget([], -1, -1)).toBeUndefined();
    });
});

/**
 * The register is driven with stand-ins for the document and the stack regions: what it asks of them — which element
 * holds focus, whether a region contains it, focusing one, listening for a key — has no geometry, so a stand-in
 * answers exactly what the browser would.
 */
describe("registerStack", () => {
    type Listener = (e: unknown) => void;

    class FakeElement {
        isConnected = true;
        listeners = new Map<string, Listener>();
        children: FakeElement[] = [];

        contains(node: unknown) {
            return node === this || this.children.includes(node as FakeElement);
        }

        focus() {
            fakeDocument.activeElement = this;
        }

        addEventListener(type: string, listener: Listener) {
            this.listeners.set(type, listener);
        }

        removeEventListener(type: string) {
            this.listeners.delete(type);
        }
    }

    const fakeDocument = {
        activeElement: undefined as unknown,
        listeners: new Map<string, Listener>(),
        addEventListener(type: string, listener: Listener) {
            this.listeners.set(type, listener);
        },
        removeEventListener(type: string) {
            this.listeners.delete(type);
        },
    };

    const releases: (() => void)[] = [];

    const OTHER_HOTKEYS = { forward: { key: "F9" }, back: { key: "F9", modifiers: ["shift" as const] } };

    const register = (
        owner: object,
        region: FakeElement,
        opts?: { holds?: boolean; scope?: object; hotkeys?: typeof OTHER_HOTKEYS | null },
    ) => {
        const release = ToastUtils.registerStack(owner, {
            region: region as unknown as HTMLElement,
            scope: opts?.scope ?? {},
            alignment: "top_left",
            hotkeys: opts?.hotkeys,
            getHasToasts: () => opts?.holds ?? true,
        });

        releases.push(release);

        return release;
    };

    const press = (key: string, shiftKey = false) => {
        const event = {
            key,
            code: key,
            shiftKey,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            defaultPrevented: false,
            isComposing: false,
            composedPath: () => [fakeDocument.activeElement],
            target: fakeDocument.activeElement,
            preventDefault: vi.fn(),
        };

        fakeDocument.listeners.get("keydown")?.(event);

        return event;
    };

    const pressEscapeIn = (region: FakeElement) => {
        const event = { key: "Escape", preventDefault: vi.fn() };

        region.listeners.get("keydown")?.(event);

        return event;
    };

    beforeEach(() => {
        vi.stubGlobal("document", fakeDocument);
        vi.stubGlobal("HTMLElement", FakeElement);
        vi.stubGlobal("HTMLInputElement", class {});
        vi.stubGlobal("HTMLTextAreaElement", class {});
        vi.stubGlobal("HTMLSelectElement", class {});
        vi.spyOn(console, "warn").mockImplementation(() => undefined);
        fakeDocument.activeElement = new FakeElement();
    });

    afterEach(() => {
        for (const release of releases.splice(0)) release();

        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("binds the shortcut once for every stack, and unbinds it with the last", () => {
        const first = register({}, new FakeElement());
        const second = register({}, new FakeElement());

        expect(fakeDocument.listeners.has("keydown"), "the page listens once a stack is registered").toBe(true);

        first();
        expect(fakeDocument.listeners.has("keydown"), "and keeps listening while one remains").toBe(true);

        second();
        expect(fakeDocument.listeners.has("keydown"), "and stops with the last").toBe(false);
    });

    it("takes F8 through the stacks in the order their providers joined, and Shift+F8 back", () => {
        const regions = [new FakeElement(), new FakeElement(), new FakeElement()];

        regions.forEach((region) => register({}, region));

        press("F8");
        expect(fakeDocument.activeElement).toBe(regions[0]);

        press("F8");
        expect(fakeDocument.activeElement, "one press moves one stack, however many stacks there are").toBe(regions[1]);

        press("F8", true);
        expect(fakeDocument.activeElement).toBe(regions[0]);

        press("F8", true);
        expect(fakeDocument.activeElement, "back from the first wraps to the last").toBe(regions[2]);
    });

    it("passes over a stack holding no toasts", () => {
        const regions = [new FakeElement(), new FakeElement(), new FakeElement()];

        register({}, regions[0]!);
        register({}, regions[1]!, { holds: false });
        register({}, regions[2]!);

        press("F8");
        press("F8");

        expect(fakeDocument.activeElement).toBe(regions[2]);
    });

    it("keeps a provider's place when it joins again, and puts a new provider last", () => {
        const owners = [{}, {}, {}];
        const regions = [new FakeElement(), new FakeElement(), new FakeElement()];

        register(owners[0]!, regions[0]!);
        const releaseSecond = register(owners[1]!, regions[1]!);
        register(owners[2]!, regions[2]!);

        releaseSecond();
        register(owners[1]!, regions[1]!);

        press("F8");
        press("F8");
        expect(fakeDocument.activeElement, "the provider that joined again is still second").toBe(regions[1]);

        const latecomer = new FakeElement();

        register({}, latecomer);
        press("F8", true);
        press("F8", true);
        expect(fakeDocument.activeElement, "and a provider joining later comes after every earlier one").toBe(
            latecomer,
        );
    });

    it("cycles each pair of shortcuts through the stacks that answer to it, and no others", () => {
        const regions = [new FakeElement(), new FakeElement(), new FakeElement(), new FakeElement()];

        register({}, regions[0]!);
        register({}, regions[1]!, { hotkeys: OTHER_HOTKEYS });
        register({}, regions[2]!);
        register({}, regions[3]!, { hotkeys: OTHER_HOTKEYS });

        press("F8");
        press("F8");
        expect(fakeDocument.activeElement, "F8 walks the stacks on the default pair").toBe(regions[2]);

        press("F9");
        expect(fakeDocument.activeElement, "F9 starts at the first stack on its own pair").toBe(regions[1]);

        press("F9");
        expect(fakeDocument.activeElement, "and walks on within it").toBe(regions[3]);

        press("F8");
        expect(fakeDocument.activeElement, "F8 from a stack on another pair starts again at its own first").toBe(
            regions[0],
        );
    });

    it("reaches a stack with no shortcuts through cycleFocus only", () => {
        const regions = [new FakeElement(), new FakeElement()];

        register({}, regions[0]!);
        register({}, regions[1]!, { hotkeys: null });

        press("F8");
        press("F8");
        expect(fakeDocument.activeElement, "no key reaches it").toBe(regions[0]);

        expect(ToastUtils.cycleFocus(1)).toBe(true);
        expect(fakeDocument.activeElement, "while cycleFocus goes through every stack").toBe(regions[1]);
    });

    it("unbinds a pair with the last stack that answered to it, and leaves the others bound", () => {
        const regions = [new FakeElement(), new FakeElement()];

        register({}, regions[0]!);
        const releaseOther = register({}, regions[1]!, { hotkeys: OTHER_HOTKEYS });

        releaseOther();
        press("F9");
        expect(fakeDocument.activeElement, "F9 does nothing once no stack answers to it").not.toBe(regions[1]);

        press("F8");
        expect(fakeDocument.activeElement, "while F8 still works").toBe(regions[0]);
    });

    it("hands focus back with Escape to where it was before the first shortcut, across pairs", () => {
        const origin = fakeDocument.activeElement;
        const regions = [new FakeElement(), new FakeElement()];

        register({}, regions[0]!);
        register({}, regions[1]!, { hotkeys: OTHER_HOTKEYS });

        press("F8");
        press("F9");
        expect(fakeDocument.activeElement).toBe(regions[1]);

        pressEscapeIn(regions[1]!);
        expect(fakeDocument.activeElement, "it is not left on the stack the other pair came from").toBe(origin);
    });

    it("hands focus back with Escape to where it was before the first F8, from whichever stack it is in", () => {
        const origin = fakeDocument.activeElement;
        const regions = [new FakeElement(), new FakeElement()];

        regions.forEach((region) => register({}, region));

        press("F8");
        press("F8");

        const escape = pressEscapeIn(regions[1]!);

        expect(fakeDocument.activeElement).toBe(origin);
        expect(escape.preventDefault, "and claims the key, so no layer above closes as well").toHaveBeenCalled();
    });

    it("leaves Escape alone when focus did not come in by the shortcut", () => {
        const region = new FakeElement();

        register({}, region);

        expect(pressEscapeIn(region).preventDefault).not.toHaveBeenCalled();
    });

    it("warns once a second provider draws at an alignment already taken in the same place, and not elsewhere", () => {
        const scope = {};

        register({}, new FakeElement(), { scope });
        register({}, new FakeElement());
        expect(console.warn, "another place is never a clash").not.toHaveBeenCalled();

        register({}, new FakeElement(), { scope });
        register({}, new FakeElement(), { scope });
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(vi.mocked(console.warn).mock.calls[0]?.[0]).toContain("top_left");
    });
});

describe("warnIfUnpainted", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("says nothing when there is a painter, and warns once when there is none", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        ToastUtils.warnIfUnpainted(true);
        expect(warn).not.toHaveBeenCalled();

        ToastUtils.warnIfUnpainted(false);
        ToastUtils.warnIfUnpainted(false);
        expect(warn).toHaveBeenCalledTimes(1);
    });
});
