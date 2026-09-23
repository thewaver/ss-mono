import type { Accessor, Signal } from "solid-js";

import { Sortable, access } from "@thewaver/ss-components";
import type { InteractionFlags, MaybeAccessor, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import { SORTABLE_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { LIST_GAP, computeCardKey, computeCardLabel } from "../SortablePage.const";
import type { Card } from "../SortablePage.types";

type Props = {
    groupId: string;
    itemsSignal: Signal<SortableItem<Card>[]>;
    ariaLabel: string;
    emptyText: string;
    orientation?: MaybeAccessor<"horizontal" | "vertical">;
    isDisabled?: MaybeAccessor<boolean>;
    isLocked?: MaybeAccessor<boolean>;
    computeCanAccept?: (value: Card, fromLabel: string) => boolean;
    onTransfer?: (toLabel: string) => void;
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderCard = (getItem: Accessor<SortableItem<Card>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => `${getItem().value.cost}`}>
        {getItem().value.name}
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
        isDisabled={() => access(props.isDisabled) ?? false}
        isLocked={() => access(props.isLocked) ?? false}
        itemsSignal={props.itemsSignal}
        computeItemKey={computeCardKey}
        computeItemLabel={computeCardLabel}
        computeCanAccept={props.computeCanAccept}
        renderItem={renderCard}
        renderCarried={(getItem) => renderCard(getItem, () => RESTING_FLAGS)}
        renderMarker={(getOrientation) => <PageSortableMarker orientation={getOrientation} />}
        renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={props.emptyText} />}
        onTransfer={(transfer) => props.onTransfer?.(transfer.toLabel)}
    />
);
