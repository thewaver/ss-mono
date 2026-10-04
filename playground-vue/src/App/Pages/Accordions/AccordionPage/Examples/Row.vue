<script setup lang="ts">
import { useModel } from "vue";

import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionExampleProps } from "../../Accordions.types";

const GAP = 5;

const PANEL_BODIES: Record<string, string> = {
    Mountains: "Cold air, long views and a path that only goes up.",
    Coast: "Salt, wind and a horizon that never quite arrives.",
    Forest: "Green light, soft ground and no straight lines anywhere.",
    Desert: "Heat by day, stars by night, and silence in between.",
};

const ITEMS: AccordionItem<string>[] = [
    { value: "Mountains" },
    { value: "Coast" },
    { value: "Forest" },
    { value: "Desert" },
];

type Props = AccordionExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");

const layerClass = useLayerClass();
</script>

<template>
    <Accordion
        v-model:expanded="expanded"
        :items="ITEMS"
        orientation="horizontal"
        sizing="fit-content"
        is-single-expand
        is-expand-required
        :gap="GAP"
    >
        <template #renderHeader="{ item, flags }">
            <div :class="[styles.rowStrip, layerClass, flags.isHovered && styles.rowStripHovered]">
                <span :class="styles.rowStripLabel">{{ item.value }}</span>
            </div>
        </template>

        <template #renderPanel="{ item, visibilityTarget, transitionDurationMs, moveDirection }">
            <div
                :class="[
                    styles.rowPanel,
                    visibilityTarget === 1 && moveDirection === 'forward' && styles.rowPanelEnterForward,
                    visibilityTarget === 1 && moveDirection === 'backward' && styles.rowPanelEnterBackward,
                ]"
                :style="{
                    opacity: visibilityTarget,
                    transition: `opacity ${transitionDurationMs}ms`,
                    animationDuration: `${transitionDurationMs}ms`,
                }"
            >
                <strong>{{ item.value }}</strong>

                <div>{{ PANEL_BODIES[item.value] }}</div>
            </div>
        </template>
    </Accordion>
</template>
