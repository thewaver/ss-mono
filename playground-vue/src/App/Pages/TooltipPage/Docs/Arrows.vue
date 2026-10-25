<script setup lang="ts">
import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

import ArrowBedTooltip from "../ArrowBedTooltip.vue";
import type { ArrowBedDocsExampleProps } from "../TooltipPageVue.types";

const CENTER_INDEX = 4;

const CELLS = [...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX), undefined, ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX)];

type Props = ArrowBedDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.arrowBed">
        <template v-for="(placement, index) in CELLS" :key="index">
            <div v-if="placement === undefined" :class="styles.arrowBedAnchor" />

            <ArrowBedTooltip
                v-else
                :arrow="arrow"
                :arrow-width="arrowWidth"
                :arrow-length="arrowLength"
                :shape="shape"
                :compute-aim="(size) => computeArrowBedAim(placement, size)"
                :label="`${placement.x} ${placement.y}`"
            />
        </template>
    </div>
</template>
