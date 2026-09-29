<script setup lang="ts">
import { computed, useModel } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.css";

import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import { applyStep } from "../SVGFiltersPage.const";
import type { SVGFiltersStackExampleProps } from "../SVGFiltersPage.types";
import StepList from "./StepList.vue";

const FILTER_ID = "svgFiltersStack";

type Props = SVGFiltersStackExampleProps;

const props = defineProps<Props>();

const applied = useModel(props, "applied");
const unused = useModel(props, "unused");

const defs = computed(() => {
    const factory = new SVGFilterDefsFactory(FILTER_ID);

    for (const item of applied.value) applyStep(factory, item.value.id);

    return factory.computeFilterPrimitives({
        method: props.method,
        elementSize: props.elementSize,
    });
});
</script>

<template>
    <div :class="styles.stack">
        <PageFilterStage :filter-id="FILTER_ID" label="stack">
            <template #renderDefs>
                <component :is="defs" v-if="defs" />
            </template>
        </PageFilterStage>

        <div :class="styles.stepLists">
            <StepList v-model:items="applied" caption="Applied" empty-text="Nothing applied" />

            <StepList v-model:items="unused" caption="Left out" empty-text="Drop here" />
        </div>
    </div>
</template>
