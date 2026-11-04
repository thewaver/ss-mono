<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Accordion, AccordionUtils } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";
import {
    headerJoins,
    panelJoins,
} from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import type { AccordionOrientationDocsExampleProps } from "../AccordionPageVue.types";

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

type Props = AccordionOrientationDocsExampleProps;

const props = defineProps<Props>();

const layerClass = useLayerClass();

const expanded = shallowRef<string[]>(["Mountains"]);
const panelSide = computed(() => AccordionUtils.getPanelSide(props.orientation));
</script>

<template>
    <div :class="styles.orientationExample" :data-orientation="orientation">
        <Accordion
            v-model:expanded="expanded"
            :items="ITEMS"
            :gap="DOCS_GAP"
            :orientation="orientation"
            :sizing="orientation === 'horizontal' ? 'fit-content' : undefined"
            is-single-expand
            is-expand-required
        >
            <template #renderHeader="{ item, flags }">
                <div
                    :class="[
                        styles.orientationStrip,
                        layerClass,
                        flags.isExpanded && styles.isExpanded,
                        flags.isHovered && styles.isHovered,
                        flags.isExpanded && headerJoins[panelSide],
                    ]"
                >
                    <span :class="styles.orientationLabel">{{ item.value }}</span>
                </div>
            </template>

            <template #renderPanel="{ item, visibilityTarget, transitionDurationMs, moveDirection }">
                <div
                    :class="[
                        styles.orientationPanel,
                        layerClass,
                        visibilityTarget === 1 && styles.isEntering,
                        visibilityTarget === 1 && panelJoins[panelSide],
                    ]"
                    :data-move="moveDirection"
                    :style="{
                        opacity: visibilityTarget,
                        transition: `opacity ${transitionDurationMs}ms`,
                        animationDuration: `${transitionDurationMs}ms`,
                    }"
                >
                    <div>{{ PANEL_BODIES[item.value] }}</div>
                </div>
            </template>
        </Accordion>
    </div>
</template>
