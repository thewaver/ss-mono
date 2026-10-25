import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ImageSwitcherUtils } from "./ImageSwitcher.utils";

describe("ImageSwitcherUtils.getLayers", () => {
    it("flips which element is shown with each swap, and the other keeps the outgoing picture", () => {
        expect(
            ImageSwitcherUtils.getLayers({ prevSrc: "a", currentSrc: "b", prevAlt: "A", currentAlt: "B", version: 1 }),
        ).toEqual([
            { src: "a", alt: "A", isShown: false },
            { src: "b", alt: "B", isShown: true },
        ]);
        expect(
            ImageSwitcherUtils.getLayers({ prevSrc: "b", currentSrc: "c", prevAlt: "B", currentAlt: "C", version: 2 }),
        ).toEqual([
            { src: "c", alt: "C", isShown: true },
            { src: "b", alt: "B", isShown: false },
        ]);
    });
});

class FakeImage {
    static started: FakeImage[] = [];

    onload: ((e: Event) => void) | null = null;
    onerror: ((e: Event) => void) | null = null;
    src = "";

    constructor() {
        FakeImage.started.push(this);
    }

    load() {
        this.onload?.(new Event("load"));
    }

    fail() {
        this.onerror?.(new Event("error"));
    }
}

describe("ImageSwitcherUtils.createSwitcher", () => {
    beforeEach(() => {
        FakeImage.started = [];
        vi.stubGlobal("Image", FakeImage);
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    const showLoaded = (switcher: ReturnType<typeof ImageSwitcherUtils.createSwitcher>, src: string, alt?: string) => {
        switcher.show(src, { alt });
        FakeImage.started.at(-1)!.load();
    };

    it("swaps a picture in once it has loaded, and reports the load", () => {
        const switcher = ImageSwitcherUtils.createSwitcher();
        const onLoad = vi.fn();

        switcher.show("a.png", { onLoad });

        expect(switcher.store.get().currentSrc, "nothing changes while the request is in flight").toBeUndefined();

        FakeImage.started[0].load();

        expect(switcher.store.get().currentSrc).toBe("a.png");
        expect(switcher.store.get().version).toBe(1);
        expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it("keeps the old picture when the new one fails, and reports the failure", () => {
        const switcher = ImageSwitcherUtils.createSwitcher();
        const onError = vi.fn();

        showLoaded(switcher, "a.png", "A knight");

        const before = switcher.store.get();

        switcher.show("missing.png", { alt: "A missing knight", onError });
        FakeImage.started.at(-1)!.fail();

        expect(switcher.store.get(), "the switcher still shows the picture it had, with its own text").toEqual(before);
        expect(onError).toHaveBeenCalledTimes(1);
    });

    it("keeps the shown picture's text while a new picture is loading", () => {
        const switcher = ImageSwitcherUtils.createSwitcher();

        showLoaded(switcher, "a.png", "A knight");

        switcher.show("b.png", { alt: "A date" });

        expect(switcher.store.get().currentAlt, "the new text waits for its picture").toBe("A knight");

        FakeImage.started.at(-1)!.load();

        expect(switcher.store.get().currentAlt).toBe("A date");
        expect(switcher.store.get().prevAlt, "and the outgoing picture keeps its own").toBe("A knight");
    });

    it("takes new text for the picture already shown without swapping", () => {
        const switcher = ImageSwitcherUtils.createSwitcher();

        showLoaded(switcher, "a.png", "A knight");

        const version = switcher.store.get().version;
        const startedBefore = FakeImage.started.length;

        switcher.show("a.png", { alt: "Un chevalier" });

        expect(switcher.store.get().currentAlt).toBe("Un chevalier");
        expect(switcher.store.get().version, "nothing is swapped").toBe(version);
        expect(FakeImage.started.length, "and nothing is loaded").toBe(startedBefore);
    });

    it("tries a failed picture again when it is asked for again", () => {
        const switcher = ImageSwitcherUtils.createSwitcher();

        showLoaded(switcher, "a.png");

        switcher.show("flaky.png");
        FakeImage.started.at(-1)!.fail();

        const startedBefore = FakeImage.started.length;

        switcher.show("flaky.png");

        expect(FakeImage.started.length, "a second preload is started").toBe(startedBefore + 1);

        FakeImage.started.at(-1)!.load();

        expect(switcher.store.get().currentSrc).toBe("flaky.png");
    });
});
