<script setup lang="ts">
import { useModel } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";

type Props = {
    "groupId": string;
    "items": SortableItem<Card>[];
    "onUpdate:items"?: (items: SortableItem<Card>[]) => void;
    "ariaLabel": string;
    "emptyText": string;
    "orientation"?: "horizontal" | "vertical";
    "isDisabled"?: boolean;
    "isLocked"?: boolean;
    "computeCanAccept"?: (value: Card, fromLabel: string) => boolean;
    "onTransfer"?: (toLabel: string) => void;
};

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const props = defineProps<Props>();

const items = useModel(props, "items");
</script>

<template>
    <Sortable
        v-model:items="items"
        :group-id="groupId"
        :ariaLabel="ariaLabel"
        :announcements="SORTABLE_ANNOUNCEMENTS"
        :orientation="orientation"
        :gap="LIST_GAP"
        :min-height="72"
        :is-disabled="isDisabled ?? false"
        :is-locked="isLocked ?? false"
        :compute-item-key="computeCardKey"
        :compute-item-label="computeCardLabel"
        :compute-can-accept="computeCanAccept"
        @transfer="(transfer) => props.onTransfer?.(transfer.toLabel)"
    >
        <template #renderItem="{ item, flags }">
            <PageSortableItemContent :flags="flags" :detail="`${item.value.cost}`">{{
                item.value.name
            }}</PageSortableItemContent>
        </template>

        <template #renderCarried="item">
            <PageSortableItemContent :flags="RESTING_FLAGS" :detail="`${item.value.cost}`">{{
                item.value.name
            }}</PageSortableItemContent>
        </template>

        <template #renderMarker="markerOrientation">
            <PageSortableMarker :orientation="markerOrientation" />
        </template>

        <template #renderDecoration="flags">
            <PageSortableSurface :flags="flags" :empty-text="emptyText" />
        </template>
    </Sortable>
</template>
