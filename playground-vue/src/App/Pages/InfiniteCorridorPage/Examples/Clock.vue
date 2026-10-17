<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Button, InfiniteCorridor, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageVue.types";
import Room from "./Room.vue";

type Props = InfiniteCorridorExampleProps;

const props = defineProps<Props>();

const progress = shallowRef(0);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isWalking = shallowRef(!prefersReducedMotion.value);

watch(prefersReducedMotion, (isReduced) => {
    if (isReduced) isWalking.value = false;
});

const lapMs = shallowRef(props.startingLapMs);

watch(
    () => props.startingLapMs,
    (next) => {
        lapMs.value = next;
    },
);

watch(
    [isWalking, lapMs],
    ([isOn, lap], _previous, onCleanup) => {
        if (!isOn) return;

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            progress.value = (progress.value + (nowMs - lastMs) / lap) % 1;
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        onCleanup(() => cancelAnimationFrame(frameId));
    },
    { immediate: true },
);

const spinDegrees = useSpinDegrees(() => props.spinDegreesPerSecond, isWalking);

const layout = computed(() => props.toLayout(spinDegrees.value));

const toggleWalking = () => {
    isWalking.value = !isWalking.value;
};
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.frame">
            <InfiniteCorridor
                v-model:progress="progress"
                :items="items"
                :layout="layout"
                :glide-duration-ms="glideDurationMs"
                ariaLabel="Walking corridor"
            >
                <template #renderItem="{ item, state }">
                    <Room :name="item" :state="state" />
                </template>
            </InfiniteCorridor>
        </div>

        <Button id="corridorWalk" :ariaLabel="isWalking ? 'Pause' : 'Walk'" @click="toggleWalking">
            <template #renderContent="flags">
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="isWalking ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
            </template>
        </Button>
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="lapMs"
            label="Lap (ms)"
            hint="How long the clock takes to walk the whole corridor once, past every room and back to the first."
        >
            <PageNumberField
                :value="lapMs"
                :reset-value="startingLapMs"
                :min="InfiniteCorridorKnobs.MIN_LAP_MS"
                :max="InfiniteCorridorKnobs.MAX_LAP_MS"
                :step="InfiniteCorridorKnobs.LAP_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Lap duration in milliseconds"
                @input="(value: number) => (lapMs = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
