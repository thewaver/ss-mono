import type { SortableGridFootprint, SortableGridItem, SortableGridSpot, SortableItem } from "@thewaver/ss-components";

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
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
];

const ZED: SortableGridFootprint = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
];

const gear = (
    id: string,
    name: string,
    glyph: string,
    col: number,
    row: number,
    footprint: SortableGridFootprint,
): SortableGridItem<Gear> => ({
    value: { id, name, glyph },
    spot: { row, col },
    footprint,
});

export const computeGearKey = (value: Gear) => value.id;

export const computeGearLabel = (value: Gear) => value.name;

export const computeGearHue = (value: Gear) =>
    [...value.id].reduce((total, letter) => (total + letter.charCodeAt(0) * HUE_STEP) % HUE_COUNT, 0);

export const PACK: SortableGridItem<Gear>[] = [
    gear("sword", "Longsword", "\u{1F5E1}", 0, 0, { rowCount: 3, colCount: 1 }),
    gear("shield", "Kite Shield", "\u{1F6E1}", 1, 0, { rowCount: 2, colCount: 2 }),
    gear("bow", "Hunting Bow", "\u{1F3F9}", 3, 0, { rowCount: 4, colCount: 1 }),
    gear("potion", "Potion", "\u{1F9EA}", 1, 2, { rowCount: 1, colCount: 1 }),
    gear("bread", "Bread", "\u{1F35E}", 2, 2, { rowCount: 1, colCount: 1 }),
    gear("scroll", "Scroll", "\u{1F4DC}", 4, 0, { rowCount: 1, colCount: 2 }),
    gear("pickaxe", "Pickaxe", "\u{26CF}", 6, 1, ELL),
    gear("chain", "Chain", "\u{26D3}", 0, 3, ZED),
];

export const STASH: SortableGridItem<Gear>[] = [
    gear("gem", "Gem", "\u{1F48E}", 0, 0, { rowCount: 1, colCount: 1 }),
    gear("tome", "Tome", "\u{1F4D5}", 1, 0, { rowCount: 2, colCount: 2 }),
    gear("rope", "Rope", "\u{1FAA2}", 0, 1, { rowCount: 2, colCount: 1 }),
];

export const ARROWS: SortableGridItem<Gear>[] = [
    gear("broadhead", "Broadhead Arrows", "\u{1F3AF}", 0, 0, { rowCount: 2, colCount: 1 }),
    gear("fire", "Fire Arrows", "\u{1F525}", 1, 0, { rowCount: 1, colCount: 1 }),
];

export const TURNS: SortableGridItem<Gear>[] = [
    gear("hook", "Hook", "\u{1FA9D}", 0, 0, ELL),
    gear("flint", "Flint", "\u{1FAA8}", 1, 0, { rowCount: 1, colCount: 1 }),
];

export const LOOT: SortableItem<Gear>[] = [
    { value: { id: "pouch", name: "Coin Pouch", glyph: "\u{1F4B0}" } },
    { value: { id: "key", name: "Iron Key", glyph: "\u{1F5DD}" } },
    { value: { id: "herb", name: "Herb", glyph: "\u{1F33F}" } },
];

export const WALLS: SortableGridSpot[] = [
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 2, col: 7 },
];

export const computeIsWall = (spot: SortableGridSpot) =>
    WALLS.some((wall) => wall.row === spot.row && wall.col === spot.col);

export const SCATTERED: SortableGridItem<Gear>[] = [
    gear("sword", "Longsword", "\u{1F5E1}", 0, 2, { rowCount: 3, colCount: 1 }),
    gear("shield", "Kite Shield", "\u{1F6E1}", 2, 3, { rowCount: 2, colCount: 2 }),
    gear("scroll", "Scroll", "\u{1F4DC}", 4, 2, { rowCount: 1, colCount: 2 }),
    gear("pickaxe", "Pickaxe", "\u{26CF}", 6, 2, ELL),
    gear("bread", "Bread", "\u{1F35E}", 1, 4, { rowCount: 1, colCount: 1 }),
    gear("potion", "Potion", "\u{1F9EA}", 5, 4, { rowCount: 1, colCount: 1 }),
];

export const ARROW_IDS = ARROWS.map((item) => item.value.id);
