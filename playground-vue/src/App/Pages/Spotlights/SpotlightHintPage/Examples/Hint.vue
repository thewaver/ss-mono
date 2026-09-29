<script setup lang="ts">
import { type ComponentPublicInstance, h, shallowRef, useModel } from "vue";

import { Button, SpotlightHint } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightHintExampleProps } from "../../Spotlights.types";

const ANCHOR_COUNT = 2;
const ANCHOR_INDICES = Array.from({ length: ANCHOR_COUNT }, (_unused, index) => index);

type Props = SpotlightHintExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const anchorRefs = shallowRef<(HTMLElement | undefined)[]>(ANCHOR_INDICES.map(() => undefined));

const setAnchorRef = (index: number, element: Element | ComponentPublicInstance | null) => {
    const next = element instanceof HTMLElement ? element : undefined;

    if (anchorRefs.value[index] === next) return;

    anchorRefs.value = anchorRefs.value.map((ref, refIndex) => (refIndex === index ? next : ref));
};

const tooltipDefs: InteractionTooltipDefs[] = ANCHOR_INDICES.map((index) => ({
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () =>
            index === 0 ? "Slides across" : "Slides down",
        ),
}));
</script>

<template>
    <div :class="styles.root">
        <PageMeasureBox :width="styles.HINT_BOX_WIDTH" :height="styles.HINT_BOX_HEIGHT">
            <div
                v-for="index in ANCHOR_INDICES"
                :key="index"
                :ref="(element) => setAnchorRef(index, element)"
                :class="index === 0 ? styles.anchorSlidingH : styles.anchorSlidingV"
            >
                <Button
                    :tooltip-defs="tooltipDefs[index]"
                    @click="
                        async () => {
                            props.onIndexChange(index);
                            visibility = !visibility;
                        }
                    "
                >
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">Highlight Me</PageButtonContent>
                    </template>
                </Button>
            </div>
        </PageMeasureBox>

        <SpotlightHint v-model:visibility="visibility" :element-ref="anchorRefs[index]" :padding="PADDING">
            <template #renderHighlight="{ visibilityTarget }">
                <SpotlightHighlight :visibility-target="visibilityTarget" />
            </template>

            <template #renderOverlay="{ visibilityTarget, transitionDurationMs, maskStyle }">
                <SpotlightOverlay
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :mask-style="maskStyle"
                />
            </template>
        </SpotlightHint>
    </div>
</template>
