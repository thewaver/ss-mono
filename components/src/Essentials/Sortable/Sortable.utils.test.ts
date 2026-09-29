import { describe, expect, it } from "vitest";

import type { CarrierZone } from "../../Abstracts/Carrier/Carrier.types";
import type { SortableAnnouncements, SortableItemRecord, SortableTransfer } from "./Sortable.types";
import { SortableUtils } from "./Sortable.utils";

type Item = SortableItemRecord<string, never>;

const ITEMS: Item[] = [
    { value: "one" },
    { value: "two", isDisabled: true },
    { value: "three", isDisabled: true, isReachableWhenDisabled: true },
    { value: "four" },
];

const keyActionOf = (key: string, opts?: { isCarrying?: boolean; isPlaced?: boolean; index?: number }) =>
    SortableUtils.computeKeyAction(key, {
        index: opts?.index ?? 0,
        isShifted: false,
        isCarrying: opts?.isCarrying ?? false,
        isPlaced: opts?.isPlaced ?? false,
        orientation: "vertical",
        direction: "ltr",
        navigable: SortableUtils.computeNavigableIndexes(ITEMS),
    });

const createList = (initial: Item[]) => {
    let items = initial;
    const transfers: SortableTransfer<string>[] = [];

    const zone = SortableUtils.createZone<string, never>({
        getItems: () => items,
        updateItems: (update) => {
            items = update(items);
        },
        getGroupId: () => "group",
        getLabel: () => "List",
        getRootRef: () => undefined,
        getBoxRef: () => undefined,
        getIsDisabled: () => false,
        getIsLocked: () => false,
        getAnnouncements: () =>
            ({ computePlaceLabel: (index, count) => `${index + 1} of ${count}` }) as SortableAnnouncements,
        getOrientation: () => "vertical",
        getDirection: () => "ltr",
        getLayout: () => undefined,
        getItemRects: () => [],
        getSourceIndex: () => undefined,
        getPlaceCount: () => items.length,
        onTransfer: (transfer) => transfers.push(transfer),
    });

    return { zone, transfers, getItems: () => items.map((item) => item.value) };
};

const CARRY = { groupId: "group", key: "x", label: "X", value: { value: "x" } };

describe("computeNavigableIndexes", () => {
    it("leaves out a disabled item unless it asked to stay reachable", () => {
        expect(SortableUtils.computeNavigableIndexes(ITEMS)).toEqual([0, 2, 3]);
    });
});

describe("computeRovingIndex", () => {
    it("keeps the tab stop where focus rested, while that item can still take it", () => {
        expect(SortableUtils.computeRovingIndex([0, 2, 3], 2)).toBe(2);
        expect(SortableUtils.computeRovingIndex([0, 2, 3], 1)).toBe(0);
        expect(SortableUtils.computeRovingIndex([], 0)).toBeUndefined();
    });
});

describe("computePlaceCount and computeSourceIndex", () => {
    const zone = {} as CarrierZone;
    const other = {} as CarrierZone;

    it("offers one extra place only to an item coming from another list", () => {
        expect(SortableUtils.computePlaceCount(3, undefined, undefined, zone)).toBe(3);
        expect(SortableUtils.computePlaceCount(3, CARRY, zone, zone)).toBe(3);
        expect(SortableUtils.computePlaceCount(3, CARRY, other, zone)).toBe(4);
    });

    it("knows where a carry started only when it started here", () => {
        expect(SortableUtils.computeSourceIndex(zone, 2, zone)).toBe(2);
        expect(SortableUtils.computeSourceIndex(other, 2, zone)).toBeUndefined();
    });

    it("marks nothing while the carry is aimed elsewhere", () => {
        expect(SortableUtils.computeLandingIndex(other, 1, undefined, zone)).toBeUndefined();
        expect(SortableUtils.computeLandingIndex(zone, 1, undefined, zone)).toBe(1);
    });
});

describe("computeKeyAction", () => {
    it("picks up and puts down with either activation key, and cancels only a carry", () => {
        expect(keyActionOf("Enter")).toEqual({ kind: "pickUp" });
        expect(keyActionOf(" ", { isCarrying: true })).toEqual({ kind: "drop" });
        expect(keyActionOf("Escape")).toBeUndefined();
        expect(keyActionOf("Escape", { isCarrying: true })).toEqual({ kind: "cancel" });
    });

    it("walks the walkable items when nothing is carried, and nudges the carry when something is", () => {
        expect(keyActionOf("ArrowDown")).toEqual({ kind: "focus", index: 2 });
        expect(keyActionOf("ArrowDown", { isCarrying: true })).toEqual({ kind: "nudge", nudge: { y: 1 } });
        expect(keyActionOf("ArrowRight", { isCarrying: true })).toBeUndefined();
    });

    it("answers to either pair of arrows in a laid-out list", () => {
        expect(keyActionOf("ArrowRight", { isCarrying: true, isPlaced: true })).toEqual({
            kind: "nudge",
            nudge: { y: 1 },
        });
        expect(keyActionOf("ArrowRight", { isPlaced: true })).toEqual({ kind: "focus", index: 2 });
    });

    it("carries to the next list with Tab, and leaves Tab alone otherwise", () => {
        expect(keyActionOf("Tab", { isCarrying: true })).toEqual({ kind: "aimAtNextZone", step: 1 });
        expect(keyActionOf("Tab")).toBeUndefined();
    });
});

describe("computeClickAction", () => {
    it("picks up with nothing carried, drops a tap, aims a key carry first, and leaves a drag alone", () => {
        expect(SortableUtils.computeClickAction(undefined)).toBe("pickUp");
        expect(SortableUtils.computeClickAction("tap")).toBe("drop");
        expect(SortableUtils.computeClickAction("key")).toBe("aimAndDrop");
        expect(SortableUtils.computeClickAction("drag")).toBeUndefined();
    });
});

describe("createZone", () => {
    it("moves an item within the list and reports where it went", () => {
        const list = createList([{ value: "a" }, { value: "b" }, { value: "c" }]);

        list.zone.moveAt(0, 2, CARRY);

        expect(list.getItems()).toEqual(["b", "c", "a"]);
        expect(list.transfers).toEqual([{ value: "a", fromLabel: "List", toLabel: "List", fromIndex: 0, toIndex: 2 }]);
    });

    it("takes an item out and puts one in, reporting the arrival", () => {
        const list = createList([{ value: "a" }, { value: "b" }]);

        list.zone.takeAt(0, CARRY);
        list.zone.putAt(1, CARRY, { label: "Other", place: 3 });

        expect(list.getItems()).toEqual(["b", "x"]);
        expect(list.transfers).toEqual([{ value: "x", fromLabel: "Other", toLabel: "List", fromIndex: 3, toIndex: 1 }]);
    });

    it("keeps a nudge inside the list's places", () => {
        const list = createList([{ value: "a" }, { value: "b" }]);

        expect(list.zone.computeNudgedPlace(1, { y: 1 }, CARRY)).toBe(1);
        expect(list.zone.computeNudgedPlace(1, { y: -1 }, CARRY)).toBe(0);
        expect(list.zone.computeNudgedPlace(1, {}, CARRY)).toBeUndefined();
    });
});
