<script setup lang="ts">
import { shallowRef } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { SortableItem } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    HAND,
    LIST_GAP,
    LIST_MIN_HEIGHT,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.vue";
import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";
import { RESTING_FLAGS } from "../SortablePageVue.const";

const items = shallowRef<SortableItem<Card>[]>(HAND);
</script>

<template>
    <div dir="rtl">
        <PageSortableRoom>
            <Sortable
                v-model:items="items"
                group-id="rightToLeft"
                ariaLabel="Row in a right-to-left box"
                orientation="horizontal"
                :announcements="SORTABLE_ANNOUNCEMENTS"
                :gap="LIST_GAP"
                :min-height="LIST_MIN_HEIGHT"
                :compute-item-key="computeCardKey"
                :compute-item-label="computeCardLabel"
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
                    <PageSortableSurface :flags="flags" empty-text="No cards" />
                </template>
            </Sortable>
        </PageSortableRoom>
    </div>
</template>
