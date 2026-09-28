import { Sortable } from "@thewaver/ss-components-react";
import type {
    InteractionFlags,
    SortableGridItem,
    SortableItem,
    SortableItemFlags,
} from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { GRID_GAP, computeGearKey, computeGearLabel } from "../SortableGridPage.const";
import { InventoryExample } from "./Inventory";

type Props = {
    groupId: string;
    lootState: readonly [SortableItem<Gear>[], (items: SortableItem<Gear>[]) => void];
    packState: readonly [SortableGridItem<Gear>[], (items: SortableGridItem<Gear>[]) => void];
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderLoot = (item: SortableItem<Gear>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags} detail={item.value.glyph}>
        {item.value.name}
    </PageSortableItemContent>
);

export const LootExample = (props: Props) => (
    <div className={styles.sortableGridPair}>
        <div className={styles.sortableGridStack}>
            <div className={styles.sortableGridCaption}>Ground</div>

            <div className={styles.sortableGridLootStrip}>
                <Sortable
                    groupId={props.groupId}
                    ariaLabel={"Ground"}
                    announcements={SORTABLE_ANNOUNCEMENTS}
                    gap={GRID_GAP}
                    minHeight={72}
                    itemsState={props.lootState}
                    computeItemKey={computeGearKey}
                    computeItemLabel={computeGearLabel}
                    renderItem={renderLoot}
                    renderCarried={(item) => renderLoot(item, RESTING_FLAGS)}
                    renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
                    renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={"Nothing left"} />}
                />
            </div>
        </div>

        <div className={styles.sortableGridStack}>
            <div className={styles.sortableGridCaption}>Pack</div>

            <InventoryExample
                groupId={props.groupId}
                itemsState={props.packState}
                ariaLabel={"Pack"}
                emptyText={"Empty pack"}
                isTurnable={true}
            />
        </div>
    </div>
);
