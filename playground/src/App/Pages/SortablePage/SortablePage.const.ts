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

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, a row of cards runs from the right, and while a card is carried the left arrow moves it on to a later place.",
    },
    betweenTwoLists: {
        title: "Between two lists",
        content:
            "Lists that share a [prop]groupId[/prop] trade cards: drag one across, tap it and then tap a place in the other list, or press Tab while carrying it from the keyboard. Set [prop]isLocked[/prop] on a list and it can still be reordered, but it takes nothing from outside.",
    },
    listRefusingSomeCards: {
        title: "A list that refuses some cards",
        content:
            "Give a list [prop]computeCanAccept[/prop] and it decides card by card what it will take: this board takes nothing costing more than 3. A refused card is refused on every route, not only when it is dropped.",
    },
    reorderingRoundRing: {
        title: "Reordering round a ring",
        content:
            "Hand [prop]computeLayout[/prop] a layout and the cards are placed by it rather than laid in a line, here round a ring. A carried card lands on the nearest place instead of being compared along one axis, since a ring has none.",
    },
};

export const ROW_RIGHT_LEFT_BOX_LABEL = "Row in a right-to-left box";
