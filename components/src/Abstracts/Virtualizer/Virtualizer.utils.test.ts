import { afterEach, describe, expect, it, vi } from "vitest";

import { VirtualizerUtils } from "./Virtualizer.utils";

/**
 * `observeScrollMargin` is left to the specs: it measures client rects, which a stand-in cannot honestly answer.
 * What is tested here is the wiring around values the browser would supply — when a report is made, and when it
 * stops being made — and the walk up the ancestors by their `overflow-y`.
 */

const createScroller = (size: { width: number; height: number }) => ({
    clientWidth: size.width,
    clientHeight: size.height,
});

const createObserverClass = () => {
    const instances: { callback: () => void; disconnected: boolean }[] = [];

    class FakeResizeObserver {
        entry: { callback: () => void; disconnected: boolean };

        constructor(callback: () => void) {
            this.entry = { callback, disconnected: false };
            instances.push(this.entry);
        }

        observe() {}

        disconnect() {
            this.entry.disconnected = true;
        }
    }

    return { ResizeObserver: FakeResizeObserver as unknown as typeof ResizeObserver, instances };
};

describe("VirtualizerUtils.observeClientRect", () => {
    it("reports the scroller's visible box straight away and again on each resize", () => {
        const scroller = createScroller({ width: 200, height: 100 });
        const { ResizeObserver, instances } = createObserverClass();
        const reports: { width: number; height: number }[] = [];

        VirtualizerUtils.observeClientRect(
            { scrollElement: scroller as unknown as Element, targetWindow: { ResizeObserver } },
            (rect) => reports.push(rect),
        );

        expect(reports).toEqual([{ width: 200, height: 100 }]);

        scroller.clientHeight = 80;
        instances[0].callback();

        expect(reports.at(-1)).toEqual({ width: 200, height: 80 });
    });

    it("reports nothing and hands back no stop when there is no scroller", () => {
        const onRect = vi.fn();

        expect(VirtualizerUtils.observeClientRect({ scrollElement: null, targetWindow: {} }, onRect)).toBeUndefined();
        expect(onRect).not.toHaveBeenCalled();
    });

    it("reports again on request while observing, and not once stopped", () => {
        const scroller = createScroller({ width: 200, height: 100 });
        const { ResizeObserver, instances } = createObserverClass();
        const instance = { scrollElement: scroller as unknown as Element, targetWindow: { ResizeObserver } };
        const onRect = vi.fn();

        const stop = VirtualizerUtils.observeClientRect(instance, onRect);

        VirtualizerUtils.remeasureClientRect(instance);

        expect(onRect).toHaveBeenCalledTimes(2);

        stop?.();
        VirtualizerUtils.remeasureClientRect(instance);

        expect(onRect).toHaveBeenCalledTimes(2);
        expect(instances[0].disconnected).toBe(true);
    });

    it("still reports once, and on request, in a window with no resize observer", () => {
        const scroller = createScroller({ width: 200, height: 100 });
        const instance = { scrollElement: scroller as unknown as Element, targetWindow: {} };
        const onRect = vi.fn();

        VirtualizerUtils.observeClientRect(instance, onRect);
        VirtualizerUtils.remeasureClientRect(instance);

        expect(onRect).toHaveBeenCalledTimes(2);
    });
});

describe("VirtualizerUtils.findScrollParent", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const createChain = (overflows: string[]) => {
        const nodes = overflows.map((overflowY) => ({ overflowY, parentElement: null as unknown }));

        nodes.forEach((node, index) => {
            node.parentElement = nodes[index + 1] ?? null;
        });

        vi.stubGlobal("getComputedStyle", (node: { overflowY: string }) => ({ overflowY: node.overflowY }));

        return nodes as unknown as HTMLElement[];
    };

    it("skips the element itself and returns the nearest ancestor whose overflow lets it scroll", () => {
        const [element, , scroller] = createChain(["auto", "visible", "auto", "scroll"]);

        expect(VirtualizerUtils.findScrollParent(element)).toBe(scroller);
    });

    it("counts every overflow that scrolls, and none that clips", () => {
        for (const overflowY of ["auto", "scroll", "overlay"]) {
            const [element, parent] = createChain(["visible", overflowY]);

            expect(VirtualizerUtils.findScrollParent(element)).toBe(parent);
        }

        const [element] = createChain(["visible", "hidden", "clip", "visible"]);

        expect(VirtualizerUtils.findScrollParent(element)).toBeUndefined();
    });
});
