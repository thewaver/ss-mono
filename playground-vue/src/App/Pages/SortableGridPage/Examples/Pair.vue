<script setup lang="ts">
import { useModel } from "vue";

import type { SortableGridItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

import { QUIVER_COLUMNS, QUIVER_ROWS, STASH_COLUMNS, STASH_ROWS } from "../SortableGridPage.const";
import InventoryExample from "./Inventory.vue";

type Props = {
    "groupId": string;
    "pack": SortableGridItem<Gear>[];
    "onUpdate:pack"?: (items: SortableGridItem<Gear>[]) => void;
    "side": SortableGridItem<Gear>[];
    "onUpdate:side"?: (items: SortableGridItem<Gear>[]) => void;
    "sideLabel": string;
    "sideEmptyText": string;
    "isSideNarrow"?: boolean;
    "isSideLocked"?: boolean;
    "computeCanAccept"?: (value: Gear, fromLabel: string) => boolean;
};

const props = defineProps<Props>();

const pack = useModel(props, "pack");
const side = useModel(props, "side");
</script>

<template>
    <div :class="styles.sortableGridPair">
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

        <div :class="styles.sortableGridStack">
            <div :class="styles.sortableGridCaption">{{ sideLabel }}</div>

            <InventoryExample
                v-model:items="side"
                :group-id="groupId"
                :ariaLabel="sideLabel"
                :empty-text="sideEmptyText"
                :columns="isSideNarrow ? QUIVER_COLUMNS : STASH_COLUMNS"
                :rows="isSideNarrow ? QUIVER_ROWS : STASH_ROWS"
                is-turnable
                :is-locked="isSideLocked ?? false"
                :compute-can-accept="computeCanAccept"
            />
        </div>
    </div>
</template>
