<script setup lang="ts">
import { type ComponentPublicInstance, h, shallowRef } from "vue";

import { Button, SpotlightHint } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsVue.types";

const ANCHORS = [
    { id: "hintAcross", tooltip: "Slides across" },
    { id: "hintDown", tooltip: "Slides down" },
];

const TOOLTIP_DEFS: InteractionTooltipDefs[] = ANCHORS.map((anchor) => ({
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => anchor.tooltip),
}));

type Props = SpotlightBasicDocsExampleProps;

defineProps<Props>();

const visibility = shallowRef(false);
const index = shallowRef(0);

const anchorRefs = shallowRef<(HTMLElement | undefined)[]>(ANCHORS.map(() => undefined));

const setAnchorRef = (anchorIndex: number, element: Element | ComponentPublicInstance | null) => {
    const next = element instanceof HTMLElement ? element : undefined;

    if (anchorRefs.value[anchorIndex] === next) return;

    anchorRefs.value = anchorRefs.value.map((ref, refIndex) => (refIndex === anchorIndex ? next : ref));
};
</script>

<template>
    <div :class="styles.root">
        <PageMeasureBox :width="styles.HINT_BOX_WIDTH" :height="styles.HINT_BOX_HEIGHT">
            <div
                v-for="(anchor, anchorIndex) in ANCHORS"
                :key="anchor.id"
                :ref="(element) => setAnchorRef(anchorIndex, element)"
                :class="anchorIndex === 0 ? styles.anchorSlidingH : styles.anchorSlidingV"
            >
                <Button
                    :id="anchor.id"
                    :tooltip-defs="TOOLTIP_DEFS[anchorIndex]"
                    @click="
                        () => {
                            index = anchorIndex;
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

        <SpotlightHint
            v-model:visibility="visibility"
            :element-ref="anchorRefs[index]"
            :padding="padding"
            :transition-duration-ms="transitionDurationMs"
        >
            <template #renderHighlight="{ visibilityTarget }">
                <SpotlightHighlight :visibility-target="visibilityTarget" />
            </template>

            <template #renderOverlay="{ visibilityTarget, transitionDurationMs: overlayDurationMs, maskStyle }">
                <SpotlightOverlay
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="overlayDurationMs"
                    :mask-style="maskStyle"
                />
            </template>
        </SpotlightHint>
    </div>
</template>
