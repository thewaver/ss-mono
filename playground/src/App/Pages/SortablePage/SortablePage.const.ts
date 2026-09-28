import type { SortableItemRecord } from "@thewaver/ss-components";

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
    { ...card("two", "Second — locked", 2), isDisabled: true },
    card("three", "Third", 3),
    card("four", "Fourth", 4),
];

export const CHEAP_ONLY = 3;
