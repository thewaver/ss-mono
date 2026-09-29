<script setup lang="ts">
import { type VNodeChild, h, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";
import { provideExampleKnobsContext } from "../ExampleKnobs/ExampleKnobs.context";
import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.vue";
import PageLayer from "../Layer/Layer.vue";
import type { ExampleProps, ExampleSlots } from "./Examples.types";

const SINGLE_SPAN = 1;
const SOURCE_MARK = "</>";

const props = defineProps<ExampleProps>();

defineSlots<ExampleSlots>();

const renderKnobs = shallowRef<() => VNodeChild>();

provideExampleKnobsContext({
    setRenderKnobs: (render) => {
        renderKnobs.value = render;
    },
});

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "View source code"),
};
</script>

<template>
    <div
        :class="styles.exampleContainer"
        :style="{ gridColumn: `span ${example.span ?? SINGLE_SPAN}` }"
        data-example=""
        :data-testid="example.key"
    >
        <PageLayer :level="1">
            <div :class="styles.exampleTitle">
                {{ `${example.name}:` }}
                <div :class="styles.exampleActions">
                    <Button
                        v-if="example.path"
                        :id="`${example.key}Source`"
                        :tooltip-defs="tooltipDefs"
                        @click="async () => props.onViewSource()"
                    >
                        <template #renderContent>{{ SOURCE_MARK }}</template>
                    </Button>

                    <PageExampleKnobsButton v-if="renderKnobs" :example-key="example.key" :example-name="example.name">
                        <template #renderKnobs><component :is="renderKnobs" /></template>
                    </PageExampleKnobsButton>
                </div>
            </div>

            <div :class="styles.exampleDemo" data-demo=""><slot /></div>

            <div v-if="example.readout" :class="styles.exampleReadout" data-readout="">{{ example.readout() }}</div>
        </PageLayer>
    </div>
</template>
