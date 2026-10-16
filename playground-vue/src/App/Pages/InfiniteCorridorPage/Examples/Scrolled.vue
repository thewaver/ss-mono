<script setup lang="ts">
import { shallowRef } from "vue";

import { ElementObserverVueUtils, InfiniteCorridor } from "@thewaver/ss-components-vue";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageVue.types";
import Room from "./Room.vue";

type Props = InfiniteCorridorExampleProps;

defineProps<Props>();

const boxRef = shallowRef<HTMLElement>();
const runwayRef = shallowRef<HTMLElement>();
const scrollLength = shallowRef(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef);

const scrollTo = (next: number) => {
    const box = boxRef.value;

    if (box) box.scrollTop = next * (box.scrollHeight - box.clientHeight);
};
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

    <PageExampleKnobs>
        <PageProp
            item-key="scrollLength"
            label="Scroll length"
            hint="How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower."
        >
            <PageNumberField
                :value="scrollLength"
                :min="InfiniteCorridorKnobs.MIN_SCROLL_LENGTH"
                :max="InfiniteCorridorKnobs.MAX_SCROLL_LENGTH"
                :step="InfiniteCorridorKnobs.SCROLL_LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Scroll length in box heights"
                @input="(value: number) => (scrollLength = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
