<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageColorField from "../../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersDropShadow";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const dx = shallowRef(SVGFilterKnobs.DropShadow.STARTING_DX);
const dy = shallowRef(SVGFilterKnobs.DropShadow.STARTING_DY);
const stdDeviation = shallowRef(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
const floodColor = shallowRef(SVGFilterKnobs.DropShadow.STARTING_COLOR);
const floodOpacity = shallowRef(SVGFilterKnobs.DropShadow.STARTING_OPACITY);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID)
        .addDropShadowFilter({
            dx: dx.value,
            dy: dy.value,
            stdDeviation: stdDeviation.value,
            floodColor: floodColor.value,
            floodOpacity: floodOpacity.value,
        })
        .computeFilterPrimitives({
            method: props.method,
            elementSize: props.elementSize,
        }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="shadow">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

    <PageExampleKnobs>
        <PageProp
            item-key="dx"
            label="Offset x"
            hint="How far the shadow is thrown sideways from the shape casting it."
        >
            <PageNumberField
                :value="dx"
                :min="SVGFilterKnobs.DropShadow.MIN_OFFSET"
                :max="SVGFilterKnobs.DropShadow.MAX_OFFSET"
                ariaLabel="Offset x"
                @input="(value: number) => (dx = value)"
            />
        </PageProp>

        <PageProp
            item-key="dy"
            label="Offset y"
            hint="How far the shadow is thrown up or down from the shape casting it."
        >
            <PageNumberField
                :value="dy"
                :min="SVGFilterKnobs.DropShadow.MIN_OFFSET"
                :max="SVGFilterKnobs.DropShadow.MAX_OFFSET"
                ariaLabel="Offset y"
                @input="(value: number) => (dy = value)"
            />
        </PageProp>

        <PageProp
            item-key="shadowStdDeviation"
            label="Std deviation"
            hint="How soft the shadow's edge is. 0 gives a hard copy of the shape."
        >
            <PageNumberField
                :value="stdDeviation"
                :min="SVGFilterKnobs.DropShadow.MIN_DEVIATION"
                :max="SVGFilterKnobs.DropShadow.MAX_DEVIATION"
                :step="SVGFilterKnobs.DropShadow.DEVIATION_STEP"
                ariaLabel="Shadow standard deviation"
                @input="(value: number) => (stdDeviation = value)"
            />
        </PageProp>

        <PageProp item-key="floodColor" label="Flood color" hint="The color the shadow is painted in.">
            <PageColorField
                :value="floodColor"
                ariaLabel="Flood color"
                @input="(value: string) => (floodColor = value)"
            />
        </PageProp>

        <PageProp item-key="floodOpacity" label="Flood opacity" hint="How solid the shadow is. 0 hides it entirely.">
            <PageNumberField
                :value="floodOpacity"
                :min="SVGFilterKnobs.DropShadow.MIN_OPACITY"
                :max="SVGFilterKnobs.DropShadow.MAX_OPACITY"
                :step="SVGFilterKnobs.DropShadow.OPACITY_STEP"
                ariaLabel="Flood opacity"
                @input="(value: number) => (floodOpacity = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
