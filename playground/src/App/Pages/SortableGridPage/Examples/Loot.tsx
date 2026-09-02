import type { Accessor, Signal } from "solid-js";

import { Sortable } from "@thewaver/ss-components";
import type { InteractionFlags, SortableGridItem, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { GRID_GAP, computeGearKey, computeGearLabel } from "../SortableGridPage.const";
import type { Gear } from "../SortableGridPage.types";
import { InventoryExample } from "./Inventory";

import * as styles from "../SortableGridPage.css";

type Props = {
    groupId: string;
    lootSignal: Signal<SortableItem<Gear>[]>;
    packSignal: Signal<SortableGridItem<Gear>[]>;
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderLoot = (getItem: Accessor<SortableItem<Gear>>, getFlags: () => InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={getFlags} detail={() => getItem().value.glyph}>
        {getItem().value.name}
    </PageSortableItemContent>
);

export const LootExample = (props: Props) => (
    <div class={styles.sortableGridPair}>
        <div class={styles.sortableGridStack}>
            <div class={styles.sortableGridCaption}>Ground</div>

            <div class={styles.sortableGridLootStrip}>
                <Sortable
                    groupId={props.groupId}
                    ariaLabel={"Ground"}
                    gap={GRID_GAP}
                    minHeight={72}
                    itemsSignal={props.lootSignal}
                    computeItemKey={computeGearKey}
                    computeItemLabel={computeGearLabel}
                    renderItem={renderLoot}
                    renderCarried={(getItem) => renderLoot(getItem, () => RESTING_FLAGS)}
                    renderMarker={(getDir) => <PageSortableMarker dir={getDir} />}
                    renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={"Nothing left"} />}
                />
            </div>
        </div>

        <div class={styles.sortableGridStack}>
            <div class={styles.sortableGridCaption}>Pack</div>

            <InventoryExample
                groupId={props.groupId}
                itemsSignal={props.packSignal}
                ariaLabel={"Pack"}
                emptyText={"Empty pack"}
                isTurnable={true}
            />
        </div>
    </div>
);
