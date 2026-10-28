<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, InfiniteCorridor } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorScrolledExampleProps } from "../InfiniteCorridorPageVue.types";
import Room from "./Room.vue";

type Props = InfiniteCorridorScrolledExampleProps;

const props = defineProps<Props>();

const boxRef = shallowRef<HTMLElement>();
const runwayRef = shallowRef<HTMLElement>();

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef);

const scrollTo = (next: number) => {
    const box = boxRef.value;

    if (box) box.scrollTop = next * (box.scrollHeight - box.clientHeight);
};

const spinDegrees = useSpinDegrees(() => props.spinDegreesPerSecond, true);

const layout = computed(() => props.toLayout(spinDegrees.value));
</script>

<template>
    <div ref="boxRef" :class="styles.scrollBox">
        <div :class="styles.scrollPinned">
            <InfiniteCorridor
                :items="items"
                :layout="layout"
                :progress="progress"
                :glide-duration-ms="glideDurationMs"
                ariaLabel="Scrolled corridor"
                @update:progress="scrollTo"
            >
                <template #renderItem="{ item, state }">
                    <Room :name="item" :state="state" />
                </template>
            </InfiniteCorridor>
        </div>

        <div
            ref="runwayRef"
            :class="styles.scrollRunway"
            :style="{ height: `${scrollLength * styles.CORRIDOR_HEIGHT}px` }"
        />
    </div>
</template>
