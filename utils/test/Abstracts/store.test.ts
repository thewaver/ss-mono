import { describe, expect, it, vi } from "vitest";

import { StoreUtils } from "../../src/Abstracts/store.js";

describe("StoreUtils.create", () => {
    it("reads back what it was made with, and what was last written", () => {
        const store = StoreUtils.create(1);

        expect(store.get()).toBe(1);

        store.set(2);

        expect(store.get()).toBe(2);
    });

    it("tells every listener after a change, with the new value already readable", () => {
        const store = StoreUtils.create("a");
        const seen: string[] = [];

        store.subscribe(() => seen.push(`first:${store.get()}`));
        store.subscribe(() => seen.push(`second:${store.get()}`));

        store.set("b");

        expect(seen).toEqual(["first:b", "second:b"]);
    });

    it("stays quiet on a write equal to what is there, and says so", () => {
        const store = StoreUtils.create(3);
        const listener = vi.fn();

        store.subscribe(listener);

        expect(store.set(3)).toBe(false);
        expect(listener).not.toHaveBeenCalled();
        expect(store.set(4)).toBe(true);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("keeps the same reference between changes, so two reads compare by identity", () => {
        const store = StoreUtils.create({ open: false });
        const before = store.get();

        expect(store.get()).toBe(before);

        store.set({ open: true });

        expect(store.get()).not.toBe(before);
    });

    it("treats a rebuilt record with the same fields as no change when told to compare shallowly", () => {
        const store = StoreUtils.create({ open: false, count: 1 }, { isEqual: StoreUtils.getIsShallowEqual });
        const listener = vi.fn();

        store.subscribe(listener);
        store.set({ open: false, count: 1 });

        expect(listener).not.toHaveBeenCalled();

        store.set({ open: true, count: 1 });

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("works the next value out from the current one", () => {
        const store = StoreUtils.create(10);

        expect(store.update((current) => current + 1)).toBe(true);
        expect(store.get()).toBe(11);
        expect(store.update((current) => current)).toBe(false);
    });

    it("ends only the subscription it was handed back for", () => {
        const store = StoreUtils.create(0);
        const listener = vi.fn();

        const stopFirst = store.subscribe(listener);
        store.subscribe(listener);

        stopFirst();
        stopFirst();
        store.set(1);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    // A listener that unsubscribes a neighbor mid-change must not stop that neighbor hearing about the change it
    // was already subscribed for — and one that subscribes mid-change must wait for the next one.
    it("tells exactly the listeners subscribed when the change happened", () => {
        const store = StoreUtils.create(0);
        const late = vi.fn();
        const second = vi.fn();

        let stopSecond = () => {};

        store.subscribe(() => {
            stopSecond();
            store.subscribe(late);
        });
        stopSecond = store.subscribe(second);

        store.set(1);

        expect(second).toHaveBeenCalledTimes(1);
        expect(late).not.toHaveBeenCalled();

        store.set(2);

        expect(second).toHaveBeenCalledTimes(1);
        expect(late).toHaveBeenCalledTimes(1);
    });
});

describe("StoreUtils.getIsShallowEqual", () => {
    it("compares one level deep", () => {
        expect(StoreUtils.getIsShallowEqual({ a: 1, b: "x" }, { a: 1, b: "x" })).toBe(true);
        expect(StoreUtils.getIsShallowEqual({ a: 1 }, { a: 2 })).toBe(false);
        expect(StoreUtils.getIsShallowEqual({ a: [1] }, { a: [1] })).toBe(false);
    });

    it("tells a missing key from one holding undefined", () => {
        expect(StoreUtils.getIsShallowEqual<{ a?: number; b?: number }>({ a: undefined }, { b: undefined })).toBe(
            false,
        );
    });
});
