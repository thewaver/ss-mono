<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ElementObserverVueUtils, Range } from "@thewaver/ss-components-vue";
import {
    CIRCLING_MAX_DEGREES,
    CIRCLING_MIN_DEGREES,
    CIRCLING_STEP_DEGREES,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeCirclingAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import { useArrowBed } from "../ArrowBed.utils";
import ArrowBedKnobs from "../ArrowBedKnobs.vue";
import ArrowBedTooltip from "../ArrowBedTooltip.vue";
import type { TooltipCirclingExampleProps } from "../TooltipPageVue.types";

type Props = TooltipCirclingExampleProps;

const props = defineProps<Props>();

const degrees = useModel(props, "degrees");

const arrowBed = useArrowBed();

const sliderRef = shallowRef<HTMLDivElement>();

const sliderSize = ElementObserverVueUtils.useBorderBoxSize(sliderRef);
</script>

<template>
    <div :class="styles.circlingStage">
        <ArrowBedTooltip
            :controls="arrowBed"
            :compute-aim="(size) => computeCirclingAim(degrees, size)"
            :label="`${degrees}°`"
        />

        <div ref="sliderRef" :class="styles.circlingSlider">
            <Range
                v-model:value="degrees"
                :min="CIRCLING_MIN_DEGREES"
                :max="CIRCLING_MAX_DEGREES"
                :step="CIRCLING_STEP_DEGREES"
                sizing="fill"
                :thumb-size="RANGE_THUMB_SIZE"
                ariaLabel="Where the arrow sits round the tooltip"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" :length="sliderSize.width" />
                </template>
            </Range>
        </div>
    </div>

    <PageExampleKnobs>
        <ArrowBedKnobs :controls="arrowBed" />
    </PageExampleKnobs>
</template>
