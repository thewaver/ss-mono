<script setup lang="ts">
import { useModel } from "vue";

import { PlacementLayoutUtils, Sortable } from "@thewaver/ss-components-vue";
import type { ArcDefs, InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LIST_GAP,
    computeCardKey,
    computeCardLabel,
} from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableRingMarker from "../../../StyledComponents/SortableContent/PageSortableRingMarker.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";

const RING_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 45,
    itemWidthRatio: 0.6512,
    itemHeightRatio: 0.2938,
};

const RING_LAYOUT = PlacementLayoutUtils.createArc(RING_DEFS);

const RING_WIDTH = "324px";

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

type Props = {
    "items": SortableItem<Card>[];
    "onUpdate:items"?: (items: SortableItem<Card>[]) => void;
};

const props = defineProps<Props>();

const items = useModel(props, "items");
</script>

<template>
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
                <PageSortableItemContent :flags="flags" :detail="`${item.value.cost}`" is-centerd>{{
                    item.value.name
                }}</PageSortableItemContent>
            </template>

            <template #renderCarried="item">
                <PageSortableItemContent :flags="RESTING_FLAGS" :detail="`${item.value.cost}`" is-centerd>{{
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
</template>
