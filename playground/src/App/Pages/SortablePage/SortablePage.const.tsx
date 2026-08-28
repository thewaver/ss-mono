import type { SortableItem } from "@thewaver/ss-components";

import type { Card } from "./SortablePage.types";

export const LIST_GAP = 8;

export const computeCardKey = (card: Card) => card.id;

export const computeCardLabel = (card: Card) => card.name;

const card = (id: string, name: string, cost: number): SortableItem<Card> => ({ value: { id, name, cost } });

export const HAND: SortableItem<Card>[] = [
    card("ember", "Ember Sprite", 2),
    card("gale", "Gale Warden", 3),
    card("tide", "Tide Caller", 5),
];

export const BOARD: SortableItem<Card>[] = [card("root", "Root Golem", 4)];

export const QUEUE: SortableItem<Card>[] = [
    card("one", "First", 1),
    { ...card("two", "Second — locked", 2), isDisabled: true },
    card("three", "Third", 3),
    card("four", "Fourth", 4),
];

export const CHEAP_ONLY = 3;
