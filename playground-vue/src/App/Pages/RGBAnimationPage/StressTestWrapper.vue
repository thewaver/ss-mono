<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { STRESS_ITEMS } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import StressItem from "./StressItem.vue";

type Props = BaseRGBAnimationExampleProps & {
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const isOnGraphicsCard = shallowRef(true);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});
</script>

<template>
    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp
            item-key="onGraphicsCard"
            label="On the graphics card"
            hint="Draws the stress test's channels in one canvas per item, with the keyframes worked out on the graphics card. Off, every channel is an element of its own."
            controls="Sets RGBAnimationProps.renderer in the stress test"
        >
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS" @hide-modal="playback = true" @show-modal="playback = false">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} items` }}</template>

        <template #renderItem>
            <StressItem
                v-bind="sharedProps"
                v-model:modal-playback="modalPlayback"
                :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
            />
        </template>
    </StressTest>
</template>
