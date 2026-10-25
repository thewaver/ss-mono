<script setup lang="ts">
import { shallowRef } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { SortableItem } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    QUEUE,
    RING_LAYOUT,
    RING_WIDTH,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableRingMarker from "../../../StyledComponents/SortableContent/PageSortableRingMarker.vue";
import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";
import { RESTING_FLAGS } from "../SortablePageVue.const";

const items = shallowRef<SortableItem<Card>[]>(QUEUE);
</script>

<template>
    <PageSortableRoom>
        <div :style="{ width: RING_WIDTH }">
            <Sortable
                v-model:items="items"
                group-id="ring"
                ariaLabel="Ring"
                :announcements="SORTABLE_ANNOUNCEMENTS"
                :gap="LIST_GAP"
                :compute-layout="RING_LAYOUT"
                :compute-item-key="computeCardKey"
                :compute-item-label="computeCardLabel"
            >
                <template #renderItem="{ item, flags }">
                    <PageSortableItemContent :flags="flags" :detail="`${item.value.cost}`" is-centered>{{
                        item.value.name
                    }}</PageSortableItemContent>
                </template>

                <template #renderCarried="item">
                    <PageSortableItemContent :flags="RESTING_FLAGS" :detail="`${item.value.cost}`" is-centered>{{
                        item.value.name
                    }}</PageSortableItemContent>
                </template>

                <template #renderMarker>
                    <PageSortableRingMarker />
                </template>

                <template #renderDecoration="flags">
                    <PageSortableSurface :flags="flags" empty-text="No cards" />
                </template>
            </Sortable>
        </div>
    </PageSortableRoom>
</template>
