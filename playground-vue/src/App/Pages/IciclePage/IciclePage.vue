<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ICICLE_DEFAULTS, MediaQueryMonitorVueUtils, TreemapUtils } from "@thewaver/ss-components-vue";
import type { IcicleNode } from "@thewaver/ss-components-vue";
import { IcicleKnobs } from "@thewaver/ss-playground/App/Knobs/Icicles.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import LibraryExample from "./Examples/Library.vue";

const EXAMPLES_ROOT = "/src/App/Pages/IciclePage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

const columnCount = shallowRef(ICICLE_DEFAULTS.columnCount);
const zoomDurationMs = shallowRef(ICICLE_DEFAULTS.zoomDurationMs);

const focus = shallowRef<IcicleNode<string>>(LIBRARY);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const showing = computed(() =>
    (TreemapUtils.findPath(LIBRARY, focus.value) ?? [LIBRARY]).map((node) => node.value).join("/"),
);

const examples: ExampleDefs[] = [
    {
        key: "library",
        name: "This library, by lines of code",
        span: WIDE_SPAN,
        readout: () =>
            `showing ${showing.value} — press any cell to bring it to the left at full height, the leftmost cell or Escape to go back up; the arrows walk up and down a column and across to a parent or its children`,
        path: `${EXAMPLES_ROOT}/Library.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="columnCount" label="Columns" hint="How many levels fit across at once, counting the one in view.">
            <PageNumberField
                :value="columnCount"
                :min="IcicleKnobs.MIN_COLUMN_COUNT"
                :max="IcicleKnobs.MAX_COLUMN_COUNT"
                :step="IcicleKnobs.COLUMN_COUNT_STEP"
                ariaLabel="Columns"
                @input="(value: number) => (columnCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="zoomDurationMs"
            label="Zoom duration (ms)"
            hint="How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view."
        >
            <PageNumberField
                :value="zoomDurationMs"
                :min="IcicleKnobs.MIN_ZOOM_DURATION_MS"
                :max="IcicleKnobs.MAX_ZOOM_DURATION_MS"
                :step="IcicleKnobs.ZOOM_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Zoom duration in milliseconds"
                @input="(value: number) => (zoomDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #library>
            <LibraryExample
                v-model:focus="focus"
                :column-count="columnCount"
                :zoom-duration-ms="prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs"
            />
        </template>
    </PageExamples>
</template>
