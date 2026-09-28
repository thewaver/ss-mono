import type { SortableItem } from "@thewaver/ss-components-react";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageSortableRoom } from "../../../StyledComponents/SortableContent/SortableContent";
import { CardsExample } from "./Cards";

type Props = {
    itemsState: readonly [SortableItem<Card>[], (items: SortableItem<Card>[]) => void];
};

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageSortableRoom>
                <CardsExample
                    groupId={"rightToLeft"}
                    itemsState={props.itemsState}
                    ariaLabel={"Row in a right-to-left box"}
                    emptyText={"No cards"}
                    orientation={"horizontal"}
                />
            </PageSortableRoom>
        </div>
    );
};
