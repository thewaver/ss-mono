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

const RING_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 45,
    itemWidthRatio: 0.6512,
    itemHeightRatio: 0.2938,
};

const RING_LAYOUT = PlacementLayoutUtils.createArc(RING_DEFS);

const RING_WIDTH = "324px";

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderCard = (getItem: Accessor<SortableItem<Card>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`} isCenterd={true}>
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
