import type { Accessor, Signal } from "solid-js";

import { Sortable, createRing } from "@thewaver/ss-components";
import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import {
    PageSortableItemContent,
    PageSortableRingMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { LIST_GAP, computeCardKey, computeCardLabel } from "../SortablePage.const";
import type { Card } from "../SortablePage.types";

const RING_DEFS: ArcDefs = { fit: "content", holeRadiusPx: 118, bandWidthPx: 88, labelMaxWidthRatio: 2.4 };

const RING_LAYOUT = createRing(RING_DEFS);

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderCard = (getItem: Accessor<SortableItem<Card>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`}>
        {getItem().value.name}
    </PageSortableItemContent>
);

type Props = {
    itemsSignal: Signal<SortableItem<Card>[]>;
};

export const RingExample = (props: Props) => (
    <Sortable
        groupId={"ring"}
        ariaLabel={"Ring"}
        gap={LIST_GAP}
        itemsSignal={props.itemsSignal}
        computeLayout={RING_LAYOUT}
        computeItemKey={computeCardKey}
        computeItemLabel={computeCardLabel}
        renderItem={renderCard}
        renderCarried={(getItem) => renderCard(getItem, () => RESTING_FLAGS)}
        renderMarker={() => <PageSortableRingMarker />}
        renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={"No cards"} />}
    />
);
