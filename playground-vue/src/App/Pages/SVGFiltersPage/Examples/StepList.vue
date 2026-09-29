<script setup lang="ts">
import { useModel } from "vue";

import { Sortable } from "@thewaver/ss-components-vue";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-vue";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    STEP_LIST_GAP,
    STEP_LIST_MIN_HEIGHT,
    computeStepKey,
    computeStepLabel,
} from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.css";

import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.vue";
import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.vue";
import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.vue";

const GROUP_ID = "svgFiltersSteps";

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

type Props = {
    "items": SortableItem<SVGFiltersStep>[];
    "onUpdate:items"?: (items: SortableItem<SVGFiltersStep>[]) => void;
    "caption": string;
    "emptyText": string;
};

const props = defineProps<Props>();

const items = useModel(props, "items");
</script>

<template>
    <div :class="styles.stepColumn">
        <div :class="styles.stepCaption">{{ caption }}</div>

        <Sortable
            v-model:items="items"
            :group-id="GROUP_ID"
            :ariaLabel="caption"
            :announcements="SORTABLE_ANNOUNCEMENTS"
            orientation="vertical"
            sizing="fill"
            :gap="STEP_LIST_GAP"
            :min-height="STEP_LIST_MIN_HEIGHT"
            :compute-item-key="computeStepKey"
            :compute-item-label="computeStepLabel"
        >
            <template #renderItem="{ item, flags }">
                <PageSortableItemContent :flags="flags">{{ item.value.name }}</PageSortableItemContent>
            </template>

            <template #renderCarried="item">
                <PageSortableItemContent :flags="RESTING_FLAGS">{{ item.value.name }}</PageSortableItemContent>
            </template>

            <template #renderMarker="orientation">
                <PageSortableMarker :orientation="orientation" />
            </template>

            <template #renderDecoration="flags">
                <PageSortableSurface :flags="flags" :empty-text="emptyText" />
            </template>
        </Sortable>
    </div>
</template>
