import type { Signal } from "solid-js";

import type { SortableItem } from "@thewaver/ss-components";

import { PageSortableRoom } from "../../../StyledComponents/SortableContent/SortableContent";
import type { Card } from "../SortablePage.types";
import { CardsExample } from "./Cards";

type Props = {
    itemsSignal: Signal<SortableItem<Card>[]>;
};

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageSortableRoom>
                <CardsExample
                    groupId={"rightToLeft"}
                    itemsSignal={props.itemsSignal}
                    ariaLabel={"Row in a right-to-left box"}
                    emptyText={"No cards"}
                    orientation={"horizontal"}
                />
            </PageSortableRoom>
        </div>
    );
};
