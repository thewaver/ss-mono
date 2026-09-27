import { Sortable } from "@thewaver/ss-components-react";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground-core/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground-core/App/Pages/SortablePage/SortablePage.types";

import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";

type Props = {
    groupId: string;
    itemsState: readonly [SortableItem<Card>[], (items: SortableItem<Card>[]) => void];
    ariaLabel: string;
    emptyText: string;
    orientation?: "horizontal" | "vertical";
    isDisabled?: boolean;
    isLocked?: boolean;
    computeCanAccept?: (value: Card, fromLabel: string) => boolean;
    onTransfer?: (toLabel: string) => void;
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderCard = (item: SortableItem<Card>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags} detail={`${item.value.cost}`}>
        {item.value.name}
    </PageSortableItemContent>
);

export const CardsExample = (props: Props) => (
    <Sortable
        groupId={props.groupId}
        ariaLabel={props.ariaLabel}
        announcements={SORTABLE_ANNOUNCEMENTS}
        orientation={props.orientation}
        gap={LIST_GAP}
        minHeight={72}
        isDisabled={props.isDisabled ?? false}
        isLocked={props.isLocked ?? false}
        itemsState={props.itemsState}
        computeItemKey={computeCardKey}
        computeItemLabel={computeCardLabel}
        computeCanAccept={props.computeCanAccept}
        renderItem={renderCard}
        renderCarried={(item) => renderCard(item, RESTING_FLAGS)}
        renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
        renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={props.emptyText} />}
        onTransfer={(transfer) => props.onTransfer?.(transfer.toLabel)}
    />
);
