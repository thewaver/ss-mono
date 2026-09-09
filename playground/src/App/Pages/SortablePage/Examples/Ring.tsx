import type { Accessor, Signal } from "solid-js";

import { Sortable, createArc } from "@thewaver/ss-components";
import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import {
    PageSortableItemContent,
    PageSortableRingMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { LIST_GAP, computeCardKey, computeCardLabel } from "../SortablePage.const";
import type { Card } from "../SortablePage.types";

const RING_DEFS: ArcDefs = { widthPx: 324, heightPx: 324, spreadDegrees: 360, itemWidthPx: 211, itemHeightPx: 62 };

const RING_LAYOUT = createArc(RING_DEFS);

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderCard = (getItem: Accessor<SortableItem<Card>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`} isCentred={true}>
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
