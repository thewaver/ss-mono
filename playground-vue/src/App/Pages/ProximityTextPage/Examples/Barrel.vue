<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, ProximityText } from "@thewaver/ss-components-vue";
import type { PointSource } from "@thewaver/ss-components-vue";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import { TEXT } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageVue.types";

const MIDDLE = 0.5;
const NO_HEIGHT = 0;

type Props = Pick<ProximityTextExampleProps, "isDisabled">;

defineProps<Props>();

const boxRef = shallowRef<HTMLElement>();
const textRef = shallowRef<HTMLElement>();

const travel = ElementObserverVueUtils.useScrollContainerProgress(textRef, boxRef);

const pointSource = computed((): PointSource => {
    void travel.value;

    const box = boxRef.value;
    const text = textRef.value;

    if (!box || !text || text.offsetHeight <= NO_HEIGHT) return { ratio: undefined };

    const middle = box.scrollTop + box.clientHeight * MIDDLE - text.offsetTop;

    return { ratio: { x: MIDDLE, y: middle / text.offsetHeight } };
});

const computeAnimationName = () => styles.barrelSpacing;
</script>

<template>
    <div id="barrelScrollBox" ref="boxRef" :class="styles.barrelBox">
        <div ref="textRef" :class="styles.barrelText">
            <ProximityText
                :compute-animation-name="computeAnimationName"
                :reach-px="ProximityTextKnobs.BARREL_REACH_PX"
                distance-axis="vertical"
                :is-disabled="isDisabled"
                :point-source="pointSource"
                >{{ TEXT }}</ProximityText
            >
        </div>
    </div>
</template>
