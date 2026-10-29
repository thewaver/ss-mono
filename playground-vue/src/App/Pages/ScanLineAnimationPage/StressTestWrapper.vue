<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import StressItem, { STRESS_ITEMS } from "./StressItem.vue";

const props = defineProps<ScanlineAnimationExampleProps>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const isOnGraphicsCard = shallowRef(true);
</script>

<template>
    <div>120 lines</div>

    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp
            item-key="onGraphicsCard"
            label="On the graphics card"
            hint="Draws the stress test's lines in one canvas per item, with the keyframes worked out on the graphics card. Off, every line is an element of its own."
            controls="Sets ScanlineAnimationProps.renderer in the stress test"
        >
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS" @hide-modal="playback = true" @show-modal="playback = false">
        <template #renderLabel="{ configIndex }">{{
            `Render ${STRESS_ITEMS[configIndex].count} ${STRESS_ITEMS[configIndex].kind} items`
        }}</template>

        <template #renderItem="{ configIndex }">
            <StressItem
                v-bind="props"
                v-model:modal-playback="modalPlayback"
                :config-index="configIndex"
                :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
            />
        </template>
    </StressTest>
</template>
