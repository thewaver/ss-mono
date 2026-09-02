import type { SortableGridFootprint, SortableGridItem, SortableItem } from "@thewaver/ss-components";

import type { Gear } from "./SortableGridPage.types";

const HUE_COUNT = 360;
const HUE_STEP = 47;

export const CELL_SIZE = 44;
export const GRID_GAP = 4;

export const PACK_COLUMNS = 8;
export const PACK_ROWS = 5;

export const STASH_COLUMNS = 4;
export const STASH_ROWS = 5;

export const QUIVER_COLUMNS = 3;
export const QUIVER_ROWS = 3;

export const TURNS_COLUMNS = 3;
export const TURNS_ROWS = 3;

const ELL: SortableGridFootprint = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
];

const ZED: SortableGridFootprint = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
];

const gear = (
    id: string,
    name: string,
    glyph: string,
    x: number,
    y: number,
    footprint: SortableGridFootprint,
): SortableGridItem<Gear> => ({
    value: { id, name, glyph },
    spot: { x, y },
    footprint,
});

export const computeGearKey = (value: Gear) => value.id;

export const computeGearLabel = (value: Gear) => value.name;

export const computeGearHue = (value: Gear) =>
    [...value.id].reduce((total, letter) => (total + letter.charCodeAt(0) * HUE_STEP) % HUE_COUNT, 0);

export const PACK: SortableGridItem<Gear>[] = [
    gear("sword", "Longsword", "\u{1F5E1}", 0, 0, { width: 1, height: 3 }),
    gear("shield", "Kite Shield", "\u{1F6E1}", 1, 0, { width: 2, height: 2 }),
    gear("bow", "Hunting Bow", "\u{1F3F9}", 3, 0, { width: 1, height: 4 }),
    gear("potion", "Potion", "\u{1F9EA}", 1, 2, { width: 1, height: 1 }),
    gear("bread", "Bread", "\u{1F35E}", 2, 2, { width: 1, height: 1 }),
    gear("scroll", "Scroll", "\u{1F4DC}", 4, 0, { width: 2, height: 1 }),
    gear("pickaxe", "Pickaxe", "\u{26CF}", 6, 1, ELL),
    gear("chain", "Chain", "\u{26D3}", 0, 3, ZED),
];

export const STASH: SortableGridItem<Gear>[] = [
    gear("gem", "Gem", "\u{1F48E}", 0, 0, { width: 1, height: 1 }),
    gear("tome", "Tome", "\u{1F4D5}", 1, 0, { width: 2, height: 2 }),
    gear("rope", "Rope", "\u{1FAA2}", 0, 1, { width: 1, height: 2 }),
];

export const ARROWS: SortableGridItem<Gear>[] = [
    gear("broadhead", "Broadhead Arrows", "\u{1F3AF}", 0, 0, { width: 1, height: 2 }),
    gear("fire", "Fire Arrows", "\u{1F525}", 1, 0, { width: 1, height: 1 }),
];

export const TURNS: SortableGridItem<Gear>[] = [
    gear("hook", "Hook", "\u{1FA9D}", 0, 0, ELL),
    gear("flint", "Flint", "\u{1FAA8}", 1, 0, { width: 1, height: 1 }),
];

export const LOOT: SortableItem<Gear>[] = [
    { value: { id: "pouch", name: "Coin Pouch", glyph: "\u{1F4B0}" } },
    { value: { id: "key", name: "Iron Key", glyph: "\u{1F5DD}" } },
    { value: { id: "herb", name: "Herb", glyph: "\u{1F33F}" } },
];

export const ARROW_IDS = ARROWS.map((item) => item.value.id);
