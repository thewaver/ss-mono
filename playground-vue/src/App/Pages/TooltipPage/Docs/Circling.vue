<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import {
    CIRCLING_MAX_DEGREES,
    CIRCLING_MIN_DEGREES,
    CIRCLING_STEP_DEGREES,
    STARTING_CIRCLING_DEGREES,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeCirclingAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import ArrowBedTooltip from "../ArrowBedTooltip.vue";
import type { ArrowBedDocsExampleProps } from "../TooltipPageVue.types";

type Props = ArrowBedDocsExampleProps;

defineProps<Props>();

const degrees = shallowRef(STARTING_CIRCLING_DEGREES);
</script>

<template>
    <div :class="styles.circlingStage">
        <ArrowBedTooltip
            :arrow="arrow"
            :arrow-width="arrowWidth"
            :arrow-length="arrowLength"
            :shape="shape"
            :compute-aim="(size) => computeCirclingAim(degrees, size)"
            :label="`${degrees}°`"
        />

        <div :class="styles.circlingSlider">
            <Range
                id="circlingDegrees"
                v-model:value="degrees"
                :min="CIRCLING_MIN_DEGREES"
                :max="CIRCLING_MAX_DEGREES"
                :step="CIRCLING_STEP_DEGREES"
                sizing="fill"
                :thumb-size="RANGE_THUMB_SIZE"
                ariaLabel="Where the arrow sits round the tooltip"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" />
                </template>
            </Range>
        </div>
    </div>
</template>
