<script setup lang="ts">
import { type VNodeChild, h, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";
import { provideExampleKnobsContext } from "../ExampleKnobs/ExampleKnobs.context";
import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.vue";
import PageLayer from "../Layer/Layer.vue";
import type { ExampleProps, ExampleSlots } from "./Examples.types";

const SINGLE_SPAN = 1;
const SOURCE_MARK = "</>";

const props = defineProps<ExampleProps>();

const nextLayerClass = useNextLayerClass();

defineSlots<ExampleSlots>();

const renderKnobs = shallowRef<() => VNodeChild>();

provideExampleKnobsContext({
    setRenderKnobs: (render) => {
        renderKnobs.value = render;
    },
});

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs, arrowAim }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs, arrowAim }, () => "View source code"),
};
</script>

<template>
    <div
        :class="[styles.exampleContainer, nextLayerClass]"
        :style="{ gridColumn: `span ${example.span ?? SINGLE_SPAN}` }"
        data-example=""
        :data-testid="example.key"
    >
        <PageLayer>
            <div :class="styles.exampleTitle">
                {{ `${example.name}:` }}
                <div :class="styles.exampleActions">
                    <Button
                        v-if="example.path"
                        :id="`${example.key}Source`"
                        :ariaLabel="`${example.name} source code`"
                        :tooltip-defs="tooltipDefs"
                        @click="async () => props.onViewSource()"
                    >
                        <template #renderContent>
                            <span :class="styles.exampleActionMark" aria-hidden="true">{{ SOURCE_MARK }}</span>
                        </template>
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
