import type { Accessor, Signal } from "solid-js";

import { PlacementLayoutUtils, Sortable } from "@thewaver/ss-components";
import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import {
    PageSortableItemContent,
    PageSortableRingMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { LIST_GAP, computeCardKey, computeCardLabel } from "../SortablePage.const";
import type { Card } from "../SortablePage.types";

const RING_DEFS: ArcDefs = { width: 324, height: 324, spreadDegrees: 360, itemWidth: 211, itemHeight: 62 };

const RING_LAYOUT = PlacementLayoutUtils.createArc(RING_DEFS);

const RING_WIDTH = `${RING_DEFS.width}px`;

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
    <div style={{ width: RING_WIDTH }}>
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
    </div>
);
