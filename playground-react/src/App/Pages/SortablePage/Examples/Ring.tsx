import { PlacementLayoutUtils, Sortable } from "@thewaver/ss-components-react";
import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import {
    PageSortableItemContent,
    PageSortableRingMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";

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

const renderCard = (item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags} detail={`${item.value.cost}`} isCenterd={true}>
        {item.value.name}
    </PageSortableItemContent>
);

type Props = {
    items: readonly [SortableItem<Card>[], (items: SortableItem<Card>[]) => void];
};

export const RingExample = (props: Props) => (
    <div style={{ width: RING_WIDTH }}>
        <Sortable
            groupId={"ring"}
            ariaLabel={"Ring"}
            announcements={SORTABLE_ANNOUNCEMENTS}
            gap={LIST_GAP}
            items={props.items}
            computeLayout={RING_LAYOUT}
            computeItemKey={computeCardKey}
            computeItemLabel={computeCardLabel}
            renderItem={renderCard}
            renderCarried={(item) => renderCard(item, RESTING_FLAGS)}
            renderMarker={() => <PageSortableRingMarker />}
            renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"No cards"} />}
        />
    </div>
);
