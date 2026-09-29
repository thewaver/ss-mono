import type { Signal } from "solid-js";

import type { SortableItem } from "@thewaver/ss-components-solid";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import { PageSortableRoom } from "../../../StyledComponents/SortableContent/SortableContent";
import { CardsExample } from "./Cards";

type Props = {
    items: Signal<SortableItem<Card>[]>;
};

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageSortableRoom>
                <CardsExample
                    groupId={"rightToLeft"}
                    items={props.items}
                    ariaLabel={"Row in a right-to-left box"}
                    emptyText={"No cards"}
                    orientation={"horizontal"}
                />
            </PageSortableRoom>
        </div>
    );
};
