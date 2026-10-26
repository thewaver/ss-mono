import { type ArcDefs, PlacementLayoutUtils, type SortableItemRecord } from "@thewaver/ss-components";

import type { Card } from "./SortablePage.types";

type CardItem = SortableItemRecord<Card, never>;

export const LIST_GAP = 8;

export const computeCardKey = (card: Card) => card.id;

export const computeCardLabel = (card: Card) => card.name;

const card = (id: string, name: string, cost: number): CardItem => ({ value: { id, name, cost } });

export const HAND: CardItem[] = [
    card("ember", "Ember Sprite", 2),
    card("gale", "Gale Warden", 3),
    card("tide", "Tide Caller", 5),
];

export const BOARD: CardItem[] = [card("root", "Root Golem", 4)];

export const QUEUE: CardItem[] = [
    card("one", "First", 1),
    { ...card("two", "Second", 2), isDisabled: true },
    card("three", "Third", 3),
    card("four", "Fourth", 4),
];

export const CHEAP_ONLY = 3;

export const EXAMPLE_NAMES = {
    reorder: "Reordering one list",
    row: "Laid out in a row",
    rightToLeft: "A row in a right-to-left box",
    ring: "Reordering round a ring",
    pair: "Between two lists",
    picky: "A list that refuses some cards",
    locked: "A list that takes nothing",
    disabled: "Disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/SortablePage/Examples";

export const DOCS_ROOT = "/src/App/Pages/SortablePage/Docs";

export const LIST_MIN_HEIGHT = 72;

export const LIST_MIN_WIDTH = 192;

export const RING_DEFS: ArcDefs = {
    ovalHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 45,
    itemWidthRatio: 0.375,
    itemHeightRatio: 0.125,
};

export const RING_LAYOUT = PlacementLayoutUtils.createArc(RING_DEFS);

export const RING_WIDTH = "400px";
