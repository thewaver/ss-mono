import type { SortableOrientation } from "@thewaver/ss-components";

export type Card = {
    id: string;
    name: string;
    cost: number;
};

export type BaseSortableBasicDocsExampleValues = {
    orientation: SortableOrientation;
    isDisabled: boolean;
};

export type BaseSortablePairDocsExampleValues = {
    isBoardLocked: boolean;
};
