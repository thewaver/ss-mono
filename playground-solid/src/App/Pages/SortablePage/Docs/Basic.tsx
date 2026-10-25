import { createSignal } from "solid-js";

import { Sortable } from "@thewaver/ss-components-solid";
import type { SortableItem } from "@thewaver/ss-components-solid";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    LIST_MIN_HEIGHT,
    QUEUE,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import {
    PageSortableMarker,
    PageSortableRoom,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { RESTING_FLAGS, renderSortableCard } from "../SortablePageSolid.const";
import type { SortableBasicDocsExampleProps } from "../SortablePageSolid.types";

type Props = SortableBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const items = createSignal<SortableItem<Card>[]>(QUEUE);

    return (
        <PageSortableRoom>
            <Sortable
                groupId={"queue"}
                ariaLabel={"Queue"}
                orientation={props.orientation}
                announcements={SORTABLE_ANNOUNCEMENTS}
                gap={LIST_GAP}
                minHeight={LIST_MIN_HEIGHT}
                isDisabled={props.isDisabled}
                items={items}
                computeItemKey={computeCardKey}
                computeItemLabel={computeCardLabel}
                renderItem={renderSortableCard}
                renderCarried={(getItem) => renderSortableCard(getItem, () => RESTING_FLAGS)}
                renderMarker={(getOrientation) => <PageSortableMarker orientation={getOrientation} />}
                renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={"No cards"} />}
            />
        </PageSortableRoom>
    );
};
