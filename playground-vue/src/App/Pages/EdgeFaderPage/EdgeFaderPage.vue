<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-vue";
import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CardExample from "./Examples/Card.vue";
import ColumnExample from "./Examples/Column.vue";
import GridExample from "./Examples/Grid.vue";
import StripExample from "./Examples/Strip.vue";

const size = shallowRef(EDGE_FADER_DEFAULTS.size);
const isScrollAware = shallowRef(EDGE_FADER_DEFAULTS.isScrollAware);

const modeText = computed(() =>
    isScrollAware.value
        ? "a side fades only while there is more past it, and sharpens as that end arrives"
        : "the chosen sides are faded wherever the scroll stands",
);

const examples: ExampleDefs[] = [
    {
        key: "column",
        name: EXAMPLE_NAMES.column,
        readout: () => `a scrolling column — ${modeText.value}`,
        path: `${EXAMPLES_ROOT}/Column.vue`,
    },
    {
        key: "strip",
        name: EXAMPLE_NAMES.strip,
        readout: () => `a scrolling strip — ${modeText.value}`,
        path: `${EXAMPLES_ROOT}/Strip.vue`,
    },
    {
        key: "grid",
        name: EXAMPLE_NAMES.grid,
        readout: () => `scrolls both ways, and the two fades meet in the corners — ${modeText.value}`,
        path: `${EXAMPLES_ROOT}/Grid.vue`,
    },
    {
        key: "card",
        name: EXAMPLE_NAMES.card,
        readout: () =>
            isScrollAware.value
                ? "nothing is out of view, so nothing fades"
                : "the fade does not need a scroll to be drawn",
        path: `${EXAMPLES_ROOT}/Card.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="size"
            controls="Sets EdgeFaderProps.size"
            label="Fade size (px)"
            hint="How far in from each side the fade reaches."
        >
            <PageNumberField
                :value="size"
                :min="EdgeFaderKnobs.MIN_SIZE"
                :max="EdgeFaderKnobs.MAX_SIZE"
                :step="EdgeFaderKnobs.SIZE_STEP"
                ariaLabel="Fade size"
                @input="(value: number) => (size = value)"
            />
        </PageProp>

        <PageProp
            item-key="isScrollAware"
            controls="Sets EdgeFaderProps.isScrollAware"
            label="Scroll-aware"
            hint="Whether a side fades only while there is more to scroll to past it."
        >
            <PageCheckField
                :value="isScrollAware"
                ariaLabel="Scroll-aware"
                @change="(value: boolean) => (isScrollAware = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="400">
        <template #column>
            <ColumnExample :size="size" :is-scroll-aware="isScrollAware" />
        </template>

        <template #strip>
            <StripExample :size="size" :is-scroll-aware="isScrollAware" />
        </template>

        <template #grid>
            <GridExample :size="size" :is-scroll-aware="isScrollAware" />
        </template>

        <template #card>
            <CardExample :size="size" :is-scroll-aware="isScrollAware" />
        </template>
    </PageExamples>
</template>
