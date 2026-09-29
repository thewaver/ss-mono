<script setup lang="ts">
import { useModel } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { InteractionFlags, SortableGridItem, SortableItem, SortableItemFlags } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";
import { GRID_GAP, computeGearKey, computeGearLabel } from "../SortableGridPage.const";
import InventoryExample from "./Inventory.vue";

type Props = {
    "groupId": string;
    "loot": SortableItem<Gear>[];
    "onUpdate:loot"?: (items: SortableItem<Gear>[]) => void;
    "pack": SortableGridItem<Gear>[];
    "onUpdate:pack"?: (items: SortableGridItem<Gear>[]) => void;
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const props = defineProps<Props>();

const loot = useModel(props, "loot");
const pack = useModel(props, "pack");
</script>

<template>
    <div :class="styles.sortableGridPair">
        <div :class="styles.sortableGridStack">
            <div :class="styles.sortableGridCaption">Ground</div>

            <div :class="styles.sortableGridLootStrip">
                <Sortable
                    v-model:items="loot"
                    :group-id="groupId"
                    ariaLabel="Ground"
                    :announcements="SORTABLE_ANNOUNCEMENTS"
                    :gap="GRID_GAP"
                    :min-height="72"
                    :compute-item-key="computeGearKey"
                    :compute-item-label="computeGearLabel"
                >
                    <template #renderItem="{ item, flags }">
                        <PageSortableItemContent :flags="flags" :detail="item.value.glyph">{{
                            item.value.name
                        }}</PageSortableItemContent>
                    </template>

                    <template #renderCarried="item">
                        <PageSortableItemContent :flags="RESTING_FLAGS" :detail="item.value.glyph">{{
                            item.value.name
                        }}</PageSortableItemContent>
                    </template>

                    <template #renderMarker="orientation">
                        <PageSortableMarker :orientation="orientation" />
                    </template>

                    <template #renderDecoration="flags">
                        <PageSortableSurface :flags="flags" empty-text="Nothing left" />
                    </template>
                </Sortable>
            </div>
        </div>

        <div :class="styles.sortableGridStack">
            <div :class="styles.sortableGridCaption">Pack</div>

            <InventoryExample
                v-model:items="pack"
                :group-id="groupId"
                ariaLabel="Pack"
                empty-text="Empty pack"
                is-turnable
            />
        </div>
    </div>
</template>
