<script setup lang="ts">
import { shallowRef } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { SortableItem } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    CHEAP_ONLY,
    HAND,
    LIST_GAP,
    LIST_MIN_HEIGHT,
    LIST_MIN_WIDTH,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";
import { RESTING_FLAGS } from "../SortablePageVue.const";

const hand = shallowRef<SortableItem<Card>[]>(HAND);
const board = shallowRef<SortableItem<Card>[]>([]);
</script>

<template>
    <div :class="styles.sortablePair">
        <div :class="styles.sortableColumn">
            <div :class="styles.sortableCaption">Hand</div>

            <Sortable
                v-model:items="hand"
                group-id="picky"
                ariaLabel="Hand"
                :announcements="SORTABLE_ANNOUNCEMENTS"
                :gap="LIST_GAP"
                :min-height="LIST_MIN_HEIGHT"
                :min-width="LIST_MIN_WIDTH"
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
        </div>

        <div :class="styles.sortableColumn">
            <div :class="styles.sortableCaption">Board</div>

            <Sortable
                v-model:items="board"
                group-id="picky"
                ariaLabel="Board"
                :announcements="SORTABLE_ANNOUNCEMENTS"
                :gap="LIST_GAP"
                :min-height="LIST_MIN_HEIGHT"
                :min-width="LIST_MIN_WIDTH"
                :compute-can-accept="(card: Card) => card.cost <= CHEAP_ONLY"
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
                    <PageSortableSurface :flags="flags" empty-text="Play a card here" />
                </template>
            </Sortable>
        </div>
    </div>
</template>
